import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Compte() {
    const auth = useContext(AuthContext);

    const utilisateurs = JSON.parse(localStorage.getItem("utilisateurs")) || [];
    const utilisateur = utilisateurs.find((u) => u.id === auth.userId) || {};

    const [messageInfos, setMessageInfos] = useState("");
    const [erreurInfos, setErreurInfos] = useState("");
    const [messageMdp, setMessageMdp] = useState("");
    const [erreurMdp, setErreurMdp] = useState("");

    //modifier un utilisateur dans le localStorage
    const modifierUtilisateur = (changements) => {
        const tous = JSON.parse(localStorage.getItem("utilisateurs")) || [];
        const misAJour = tous.map((u) => (u.id === auth.userId ? { ...u, ...changements } : u));
        localStorage.setItem("utilisateurs", JSON.stringify(misAJour));
    };

    //enregistrer prenom, nom et courriel
    const enregistrerInfos = (event) => {
        event.preventDefault();
        setErreurInfos("");
        const data = Object.fromEntries(new FormData(event.target).entries());
        const nouveauCourriel = data.courriel.trim();
        const ancienCourriel = auth.email;

        if (nouveauCourriel !== ancienCourriel) {
            //le courriel ne doit pas deja etre utilise
            const tous = JSON.parse(localStorage.getItem("utilisateurs")) || [];
            const dejaUtilise = tous.some((u) => u.email === nouveauCourriel && u.id !== auth.userId);
            if (dejaUtilise || nouveauCourriel === "admin@nota.com") {
                setErreurInfos("Ce courriel est déjà utilisé.");
                return;
            }

            //garder les notes partagees avec l'ancien courriel
            const notes = JSON.parse(localStorage.getItem("notes")) || [];
            const notesMisesAJour = notes.map((note) =>
                note.partageAvec
                    ? { ...note, partageAvec: note.partageAvec.map((c) => (c === ancienCourriel ? nouveauCourriel : c)) }
                    : note
            );
            localStorage.setItem("notes", JSON.stringify(notesMisesAJour));
        }

        modifierUtilisateur({ prenom: data.prenom, nom: data.nom, email: nouveauCourriel });

        //mettre a jour le courriel de la session en cours
        if (nouveauCourriel !== ancienCourriel) {
            auth.login(auth.userId, nouveauCourriel, auth.role);
        }

        setMessageInfos("Vos informations ont été enregistrées.");
    };

    //changer le mot de passe
    const changerMotDePasse = (event) => {
        event.preventDefault();
        setErreurMdp("");
        setMessageMdp("");
        const data = Object.fromEntries(new FormData(event.target).entries());

        if (data.actuel !== utilisateur.password) {
            setErreurMdp("Le mot de passe actuel est incorrect.");
            return;
        }
        if (data.nouveau !== data.confirmer) {
            setErreurMdp("Les nouveaux mots de passe doivent être pareils.");
            return;
        }

        modifierUtilisateur({ password: data.nouveau });
        setMessageMdp("Votre mot de passe a été changé.");
        event.target.reset();
    };

    return (
        <div className="compte">
            <h2>Mon compte</h2>

            {/* informations personnelles */}
            <section className="compte_section">
                <h3>Informations personnelles</h3>
                <form
                    className="compte_form"
                    onSubmit={enregistrerInfos}
                    onChange={() => { setMessageInfos(""); setErreurInfos(""); }}
                >
                    <div className="compte_rangee">
                        <div className="compte_control">
                            <label htmlFor="prenom">Prénom</label>
                            <input id="prenom" name="prenom" type="text" defaultValue={utilisateur.prenom} />
                        </div>
                        <div className="compte_control">
                            <label htmlFor="nom">Nom</label>
                            <input id="nom" name="nom" type="text" defaultValue={utilisateur.nom} />
                        </div>
                    </div>
                    <div className="compte_control">
                        <label htmlFor="courriel">Courriel</label>
                        <input id="courriel" name="courriel" type="email" defaultValue={auth.email} required />
                    </div>
                    {erreurInfos && <p className="compte_erreur">{erreurInfos}</p>}
                    {messageInfos && <p className="compte_succes">{messageInfos}</p>}
                    <button type="submit" className="compte_bouton">Enregistrer</button>
                </form>
            </section>

            {/* mot de passe */}
            <section className="compte_section">
                <h3>Mot de passe</h3>
                <form className="compte_form" onSubmit={changerMotDePasse}>
                    <div className="compte_control">
                        <label htmlFor="actuel">Mot de passe actuel</label>
                        <input id="actuel" name="actuel" type="password" required />
                    </div>
                    <div className="compte_rangee">
                        <div className="compte_control">
                            <label htmlFor="nouveau">Nouveau mot de passe</label>
                            <input id="nouveau" name="nouveau" type="password" required />
                        </div>
                        <div className="compte_control">
                            <label htmlFor="confirmer">Confirmer</label>
                            <input id="confirmer" name="confirmer" type="password" required />
                        </div>
                    </div>
                    {erreurMdp && <p className="compte_erreur">{erreurMdp}</p>}
                    {messageMdp && <p className="compte_succes">{messageMdp}</p>}
                    <button type="submit" className="compte_bouton">Changer le mot de passe</button>
                </form>
            </section>

            {/* statut d'abonnement */}
            <section className="compte_section">
                <h3>Abonnement</h3>
                <div className="compte_abonnement">
                    <div>
                        <p className="compte_forfait">Forfait Gratuit</p>
                        <p className="compte_aide">Jusqu'à 10 notes</p>
                    </div>
                    <Link to="/abonnement" className="compte_bouton compte_bouton_contour">
                        Gérer mon abonnement
                    </Link>
                </div>
            </section>
        </div>
    );
}