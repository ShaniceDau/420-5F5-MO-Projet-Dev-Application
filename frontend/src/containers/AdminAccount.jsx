import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./AdminUsers.css";
import "./AdminAccount.css";

export default function AdminCompte() {
    const { userId } = useParams();

    const [utilisateurs, setUtilisateurs] = useState(
        JSON.parse(localStorage.getItem("utilisateurs")) || []
    );
    const [message, setMessage] = useState("");
    const [erreur, setErreur] = useState("");

    const utilisateur = utilisateurs.find((u) => u.id === userId);

    if (!utilisateur) {
        return (
            <div className="admin_compte">
                <Link to="/admin/utilisateurs" className="admin_retour"> Utilisateurs</Link>
                <h2>Utilisateur introuvable</h2>
                <p>Ce compte n'existe pas ou a été supprimé.</p>
            </div>
        );
    }

    const notes = JSON.parse(localStorage.getItem("notes")) || [];
    const nbNotes = notes.filter((n) => n.userId === userId).length;
    const nbPartagees = notes.filter((n) => n.userId === userId && n.partageAvec && n.partageAvec.length > 0).length;
    const premium = utilisateur.abonnement === "premium";

    //valider et enregistrer les modifications du compte
    const enregistrer = (event) => {
        event.preventDefault();
        setMessage("");
        setErreur("");
        const data = Object.fromEntries(new FormData(event.target).entries());
        const nouveauCourriel = data.courriel.trim();
        const ancienCourriel = utilisateur.email;

        //le courriel ne doit pas deja etre utilise par un autre compte ou par l'admin
        const dejaUtilise = utilisateurs.some((u) => u.email === nouveauCourriel && u.id !== userId);
        if (dejaUtilise || nouveauCourriel === "admin@nota.com") {
            setErreur("Ce courriel est déjà utilisé par un autre compte.");
            return;
        }

        //nouveau mot de passe les deux champs doivent etre pareils
        if (data.motdepasse || data.confirmer) {
            if (data.motdepasse !== data.confirmer) {
                setErreur("Les deux mots de passe doivent être pareils.");
                return;
            }
        }

        const changements = {
            prenom: data.prenom.trim(),
            nom: data.nom.trim(),
            email: nouveauCourriel,
            abonnement: data.abonnement,
        };
        if (data.motdepasse) {
            changements.password = data.motdepasse;
        }

        const misAJour = utilisateurs.map((u) => (u.id === userId ? { ...u, ...changements } : u));
        localStorage.setItem("utilisateurs", JSON.stringify(misAJour));
        setUtilisateurs(misAJour);

        //si le courriel change, garder les notes qui lui etaient partagees
        if (nouveauCourriel !== ancienCourriel) {
            const notesMisesAJour = notes.map((note) =>
                note.partageAvec
                    ? { ...note, partageAvec: note.partageAvec.map((c) => (c === ancienCourriel ? nouveauCourriel : c)) }
                    : note
            );
            localStorage.setItem("notes", JSON.stringify(notesMisesAJour));
        }

        event.target.motdepasse.value = "";
        event.target.confirmer.value = "";
        setMessage("Le compte a été modifié.");
    };

    return (
        <div className="admin_compte">
            <Link to="/admin/utilisateurs" className="admin_retour">Utilisateurs</Link>

            {/* en-tete : nom et statut */}
            <div className="admin_compte_entete">
                <div>
                    <h2>{`${utilisateur.prenom || ""} ${utilisateur.nom || ""}`.trim() || utilisateur.email}</h2>
                    <p className="admin_compte_courriel">{utilisateur.email}</p>
                </div>
                <span className={`admin_statut ${premium ? "admin_statut_premium" : ""}`}>
                    {premium ? "Premium" : "Gratuit"}
                </span>
            </div>

            {/* consultation du compte */}
            <section className="admin_section">
                <h3>Informations du compte</h3>
                <dl className="admin_infos">
                    <div>
                        <dt>Identifiant</dt>
                        <dd>{utilisateur.id}</dd>
                    </div>
                    <div>
                        <dt>Prénom</dt>
                        <dd>{utilisateur.prenom || "—"}</dd>
                    </div>
                    <div>
                        <dt>Nom</dt>
                        <dd>{utilisateur.nom || "—"}</dd>
                    </div>
                    <div>
                        <dt>Courriel</dt>
                        <dd>{utilisateur.email}</dd>
                    </div>
                    <div>
                        <dt>Abonnement</dt>
                        <dd>{premium ? "Premium (notes illimitées)" : "Gratuit (10 notes maximum)"}</dd>
                    </div>
                    <div>
                        <dt>Notes</dt>
                        <dd>
                            {nbNotes} note{nbNotes > 1 ? "s" : ""}
                            {!premium && ` sur 10`}
                            {nbPartagees > 0 && ` · ${nbPartagees} partagée${nbPartagees > 1 ? "s" : ""}`}
                        </dd>
                    </div>
                </dl>
            </section>

            {/* modification du compte */}
            <section className="admin_section">
                <h3>Modifier le compte</h3>
                <form
                    className="admin_form"
                    onSubmit={enregistrer}
                    onChange={() => { setMessage(""); setErreur(""); }}
                    key={utilisateur.id}
                >
                    <div className="admin_rangee">
                        <div className="admin_control">
                            <label htmlFor="prenom">Prénom</label>
                            <input id="prenom" name="prenom" type="text" defaultValue={utilisateur.prenom} />
                        </div>
                        <div className="admin_control">
                            <label htmlFor="nom">Nom</label>
                            <input id="nom" name="nom" type="text" defaultValue={utilisateur.nom} />
                        </div>
                    </div>

                    <div className="admin_control">
                        <label htmlFor="courriel">Courriel</label>
                        <input id="courriel" name="courriel" type="email" defaultValue={utilisateur.email} required />
                    </div>

                    <div className="admin_control">
                        <label htmlFor="abonnement">Statut d'abonnement</label>
                        <select id="abonnement" name="abonnement" defaultValue={premium ? "premium" : "gratuit"}>
                            <option value="gratuit">Gratuit (10 notes maximum)</option>
                            <option value="premium">Premium (notes illimitées)</option>
                        </select>
                    </div>

                    <div className="admin_rangee">
                        <div className="admin_control">
                            <label htmlFor="motdepasse">Nouveau mot de passe</label>
                            <input id="motdepasse" name="motdepasse" type="password" autoComplete="new-password" />
                        </div>
                        <div className="admin_control">
                            <label htmlFor="confirmer">Confirmer le mot de passe</label>
                            <input id="confirmer" name="confirmer" type="password" autoComplete="new-password" />
                        </div>
                    </div>
                    <p className="admin_aide">Laissez les champs du mot de passe vides pour ne pas le changer.</p>

                    {erreur && <p className="admin_erreur">{erreur}</p>}
                    {message && <p className="admin_succes">{message}</p>}

                    <div className="admin_actions">
                        <Link to="/admin/utilisateurs" className="admin_bouton_contour">Annuler</Link>
                        <button type="submit" className="admin_bouton">Enregistrer les modifications</button>
                    </div>
                </form>
            </section>
        </div>
    );
}