import { useContext, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./NoteDetails.css";


export default function NoteDetails() {
    const auth = useContext(AuthContext);
    const { noteId } = useParams();
    const navigate = useNavigate();

    const notes = JSON.parse(localStorage.getItem("notes")) || [];
    const noteTrouvee = notes.find((n) => n.id === noteId);

    //droit de voir la note
    const estProprietaire = noteTrouvee && noteTrouvee.userId === auth.userId;
    const estPartageeAvecMoi =
        noteTrouvee && noteTrouvee.partageAvec && noteTrouvee.partageAvec.includes(auth.email);
    const note = estProprietaire || estPartageeAvecMoi ? noteTrouvee : null;

    const [titre, setTitre] = useState(note ? note.titre : "");
    const [contenu, setContenu] = useState(note ? note.contenu : "");
    const [partageAvec, setPartageAvec] = useState(note && note.partageAvec ? note.partageAvec : []);
    const [courrielPartage, setCourrielPartage] = useState("");
    const [erreurPartage, setErreurPartage] = useState("");

    if (!note) {
        return (
            <div className="note_editeur">
                <h2>Note introuvable</h2>
                <Link to="/mes-notes">Retour à mes notes</Link>
            </div>
        );
    }

    //enregistrer les changements de la note dans le localStorage
    const enregistrer = (changements) => {
        const toutes = JSON.parse(localStorage.getItem("notes")) || [];
        const misesAJour = toutes.map((n) => (n.id === noteId ? { ...n, ...changements } : n));
        localStorage.setItem("notes", JSON.stringify(misesAJour));
    };

    const changerTitre = (event) => {
        setTitre(event.target.value);
        enregistrer({ titre: event.target.value });
    };

    const changerContenu = (event) => {
        setContenu(event.target.value);
        enregistrer({ contenu: event.target.value });
    };

    const supprimer = () => {
        if (!window.confirm("Supprimer cette note ?")) return;
        const toutes = JSON.parse(localStorage.getItem("notes")) || [];
        localStorage.setItem("notes", JSON.stringify(toutes.filter((n) => n.id !== noteId)));
        navigate("/mes-notes");
    };

    //partager la note avec un autre utilisateur
    const partager = (event) => {
        event.preventDefault();
        setErreurPartage("");
        const courriel = courrielPartage.trim();

        const utilisateurs = JSON.parse(localStorage.getItem("utilisateurs")) || [];
        if (!utilisateurs.some((u) => u.email === courriel)) {
            setErreurPartage("Aucun utilisateur avec ce courriel.");
            return;
        }
        if (courriel === auth.email) {
            setErreurPartage("Vous ne pouvez pas partager une note avec vous-même.");
            return;
        }
        if (partageAvec.includes(courriel)) {
            setErreurPartage("Cette note est déjà partagée avec cette personne.");
            return;
        }

        const nouvelleListe = [...partageAvec, courriel];
        setPartageAvec(nouvelleListe);
        enregistrer({ partageAvec: nouvelleListe });
        setCourrielPartage("");
    };

    const retirerPartage = (courriel) => {
        const nouvelleListe = partageAvec.filter((c) => c !== courriel);
        setPartageAvec(nouvelleListe);
        enregistrer({ partageAvec: nouvelleListe });
    };

    //note partagee avec moi : lecture seul
    if (!estProprietaire) {
        const utilisateurs = JSON.parse(localStorage.getItem("utilisateurs")) || [];
        const proprietaire = utilisateurs.find((u) => u.id === note.userId);

        return (
            <div className="note_editeur">
                <div className="note_editeur_barre">
                    <Link to="/partagees" className="note_editeur_retour">← Partagées</Link>
                    <span className="note_editeur_statut">
                        Partagée par {proprietaire ? proprietaire.email : "un autre utilisateur"} · lecture seulement
                    </span>
                </div>
                <h2 className="note_editeur_titre">{note.titre || "Sans titre"}</h2>
                <p className="note_editeur_lecture">{note.contenu}</p>
            </div>
        );
    }

    return (
        <div className="note_editeur">
            <div className="note_editeur_barre">
                <Link to="/mes-notes" className="note_editeur_retour">← Mes notes</Link>
                <span className="note_editeur_statut">Enregistré automatiquement</span>
                <button type="button" className="note_editeur_supprimer" onClick={supprimer}>
                    Supprimer
                </button>
            </div>

            <input
                className="note_editeur_titre"
                type="text"
                placeholder="Titre de la note"
                value={titre}
                onChange={changerTitre}
                autoFocus={titre === ""}
            />

            <textarea
                className="note_editeur_contenu"
                placeholder="Commencez à écrire..."
                value={contenu}
                onChange={changerContenu}
            />

            {/* section partage */}
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

                {partageAvec.length > 0 && (
                    <ul className="note_partage_liste">
                        {partageAvec.map((courriel) => (
                            <li key={courriel}>
                                {courriel}
                                <button type="button" onClick={() => retirerPartage(courriel)}>
                                    Retirer
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}