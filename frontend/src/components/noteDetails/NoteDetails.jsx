import { useContext, useEffect, useRef, useState } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { appelApi, MESSAGE_SERVEUR } from "../../api";
import "./NoteDetails.css";

export default function NoteDetails() {
    const { noteId } = useParams();
    const location = useLocation();

    //quand une nouvelle note vient d'etre creee, l'adresse passe de /notes/nouvelle a /notes/<id>
    //on garde la meme "key" pour ne pas recharger l'editeur pendant que l'utilisateur ecrit
    const cle = (location.state && location.state.cle) || noteId;

    return <EditeurNote key={cle} noteIdDepart={noteId} />;
}

//proprietaire de la note peut ecrire, partager, supprimer
//note partagee avec moi lecture seule
function EditeurNote({ noteIdDepart }) {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    const [idDepart] = useState(noteIdDepart);
    const nouvelle = idDepart === "nouvelle";

    const [idNote, setIdNote] = useState(nouvelle ? null : idDepart);
    const [chargement, setChargement] = useState(!nouvelle);
    const [introuvable, setIntrouvable] = useState(false);
    const [erreurChargement, setErreurChargement] = useState("");
    const [partageePar, setPartageePar] = useState(null); //courriel du proprietaire si la note est partagee avec moi

    const [titre, setTitre] = useState("");
    const [contenu, setContenu] = useState("");
    const [modifie, setModifie] = useState(false);
    const [statut, setStatut] = useState(
        nouvelle ? "Écrivez un titre et du contenu pour enregistrer la note." : "Enregistré"
    );
    const [limiteAtteinte, setLimiteAtteinte] = useState(false);

    const [partages, setPartages] = useState([]); //{ id, email } pour chaque personne
    const [courrielPartage, setCourrielPartage] = useState("");
    const [erreurPartage, setErreurPartage] = useState("");

    //evite de creer la note deux fois si on tape vite pendant la creation
    const creationEnCours = useRef(false);

    //charger la note existante (et ses partages)
    useEffect(() => {
        if (nouvelle) return;
        let annule = false;

        const charger = async () => {
            try {
                const note = await appelApi(`/notes/${idDepart}`);
                const tousPartages = await appelApi("/partages");
                if (annule) return;

                const partagesDeLaNote = tousPartages.filter((p) => p.noteId && p.noteId._id === idDepart);

                if (note.userId === auth.userId) {
                    //ma note
                    setTitre(note.title);
                    setContenu(note.content);
                    setPartages(
                        partagesDeLaNote.map((p) => ({ id: p._id, email: p.sharedWith ? p.sharedWith.email : "?" }))
                    );
                } else {
                    //la note d'un autre : seulement si elle est partagee avec moi
                    const avecMoi = partagesDeLaNote.find((p) => p.sharedWith && p.sharedWith._id === auth.userId);
                    if (!avecMoi) {
                        setIntrouvable(true);
                    } else {
                        setTitre(note.title);
                        setContenu(note.content);
                        setPartageePar(avecMoi.sharedBy ? avecMoi.sharedBy.email : "un autre utilisateur");
                    }
                }
            } catch (erreur) {
                if (annule) return;
                if (erreur.status) {
                    setIntrouvable(true);
                } else {
                    setErreurChargement(MESSAGE_SERVEUR);
                }
            } finally {
                if (!annule) setChargement(false);
            }
        };

        charger();
        return () => {
            annule = true;
        };
    }, [idDepart, nouvelle, auth.userId]);

    //enregistrement automatique 
    useEffect(() => {
        if (!modifie) return;

        const minuteur = setTimeout(async () => {
            try {
                if (!idNote) {
                    //nouvelle note : le backend exige un titre et un contenu
                    if (!titre.trim() || !contenu.trim()) {
                        setStatut("Écrivez un titre et du contenu pour enregistrer la note.");
                        return;
                    }
                    if (creationEnCours.current) return;
                    creationEnCours.current = true;
                    setStatut("Enregistrement...");

                    //POST /api/notes
                    const note = await appelApi("/notes", {
                        methode: "POST",
                        corps: { title: titre, content: contenu, userId: auth.userId },
                    });
                    setIdNote(note._id);
                    navigate(`/notes/${note._id}`, { replace: true, state: { cle: "nouvelle" } });
                } else {
                    setStatut("Enregistrement...");
                    //PUT /api/notes/:id
                    await appelApi(`/notes/${idNote}`, {
                        methode: "PUT",
                        corps: { title: titre, content: contenu },
                    });
                }
                setStatut("Enregistré");
            } catch (erreur) {
                creationEnCours.current = false;
                if (erreur.status === 403) {
                    //forfait gratuit : 10 notes maximum
                    setLimiteAtteinte(true);
                    setStatut("Non enregistrée");
                } else {
                    setStatut(erreur.status ? "Erreur : la note n'a pas été enregistrée." : MESSAGE_SERVEUR);
                }
            }
        }, 700);

        return () => clearTimeout(minuteur);
    }, [titre, contenu, modifie, idNote, auth.userId, navigate]);

    const changerTitre = (event) => {
        setTitre(event.target.value);
        setModifie(true);
    };

    const changerContenu = (event) => {
        setContenu(event.target.value);
        setModifie(true);
    };

    const supprimer = async () => {
        if (!window.confirm("Supprimer cette note ?")) return;
        if (!idNote) {
            navigate("/mes-notes");
            return;
        }
        try {
            //supprimer d'abord les partages de la note, puis la note
            for (const p of partages) {
                await appelApi(`/partages/${p.id}`, { methode: "DELETE" });
            }
            await appelApi(`/notes/${idNote}`, { methode: "DELETE" });
            navigate("/mes-notes");
        } catch (erreur) {
            setStatut(erreur.status ? "Erreur : la note n'a pas été supprimée." : MESSAGE_SERVEUR);
        }
    };

    //partager la note avec un autre utilisateur inscrit
    const partager = async (event) => {
        event.preventDefault();
        setErreurPartage("");
        const courriel = courrielPartage.trim().toLowerCase();

        if (courriel === auth.email) {
            setErreurPartage("Vous ne pouvez pas partager une note avec vous-même.");
            return;
        }
        if (partages.some((p) => p.email === courriel)) {
            setErreurPartage("Cette note est déjà partagée avec cette personne.");
            return;
        }

        try {
            //GET /api/users/:email pour trouver l'id de la personne
            let destinataire;
            try {
                destinataire = await appelApi(`/users/${encodeURIComponent(courriel)}`);
            } catch (erreur) {
                if (erreur.status === 404) {
                    setErreurPartage("Aucun utilisateur avec ce courriel.");
                    return;
                }
                throw erreur;
            }

            //POST /api/partages
            const partage = await appelApi("/partages", {
                methode: "POST",
                corps: { noteId: idNote, sharedBy: auth.userId, sharedWith: destinataire._id },
            });
            setPartages([...partages, { id: partage._id, email: destinataire.email }]);
            setCourrielPartage("");
        } catch (erreur) {
            setErreurPartage(erreur.status ? "Le partage a échoué." : MESSAGE_SERVEUR);
        }
    };

    const retirerPartage = async (partage) => {
        try {
            //DELETE /api/partages/:id
            await appelApi(`/partages/${partage.id}`, { methode: "DELETE" });
            setPartages(partages.filter((p) => p.id !== partage.id));
        } catch (erreur) {
            setErreurPartage(erreur.status ? "Impossible de retirer ce partage." : MESSAGE_SERVEUR);
        }
    };

    if (chargement) {
        return (
            <div className="note_editeur">
                <p className="note_editeur_lecture">Chargement de la note...</p>
            </div>
        );
    }

    if (erreurChargement || introuvable) {
        return (
            <div className="note_editeur">
                <h2>{erreurChargement ? "Erreur" : "Note introuvable"}</h2>
                {erreurChargement && <p className="note_editeur_lecture">{erreurChargement}</p>}
                <Link to="/mes-notes" className="bouton_retour">Mes notes</Link>
            </div>
        );
    }

    //note partagee avec moi : lecture seulement
    if (partageePar) {
        return (
            <div className="note_editeur">
                <div className="note_editeur_barre">
                    <Link to="/partager" className="bouton_retour">Partage</Link>
                    <span className="note_editeur_statut">Partagée par {partageePar} · lecture seulement</span>
                </div>
                <h2 className="note_editeur_titre">{titre || "Sans titre"}</h2>
                <p className="note_editeur_lecture">{contenu}</p>
            </div>
        );
    }

    return (
        <div className="note_editeur">
            <div className="note_editeur_barre">
                <Link to="/mes-notes" className="bouton_retour">Mes notes</Link>
                <span className="note_editeur_statut">{statut}</span>
                <button type="button" className="note_editeur_supprimer" onClick={supprimer}>
                    Supprimer
                </button>
            </div>

            {limiteAtteinte && (
                <p className="note_editeur_limite">
                    Le forfait gratuit permet jusqu'à 10 notes. <Link to="/abonnement">Passez au forfait Premium</Link>{" "}
                    pour en créer davantage.
                </p>
            )}

            <input
                className="note_editeur_titre"
                type="text"
                placeholder="Titre de la note"
                value={titre}
                onChange={changerTitre}
                autoFocus={nouvelle}
            />

            <textarea
                className="note_editeur_contenu"
                placeholder="Commencez à écrire..."
                value={contenu}
                onChange={changerContenu}
            />

            {/* section partage : seulement une fois la note enregistree */}
            {idNote && (
                <div className="note_partage">
                    <h3>Partager</h3>
                    <form className="note_partage_form" onSubmit={partager}>
                        <input
                            type="email"
                            placeholder="Courriel de la personne"
                            value={courrielPartage}
                            onChange={(event) => setCourrielPartage(event.target.value)}
                            required
                        />
                        <button type="submit">Partager</button>
                    </form>
                    {erreurPartage && <p className="note_partage_erreur">{erreurPartage}</p>}

                    {partages.length > 0 && (
                        <ul className="note_partage_liste">
                            {partages.map((p) => (
                                <li key={p.id}>
                                    {p.email}
                                    <button type="button" onClick={() => retirerPartage(p)}>
                                        Retirer
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}