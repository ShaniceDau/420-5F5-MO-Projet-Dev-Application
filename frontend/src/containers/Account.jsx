import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { appelApi, MESSAGE_SERVEUR } from "../api";
import { chargerAbonnement, forfaitDe } from "../util/abonnements";
import "./Account.css";

export default function Compte() {
    const auth = useContext(AuthContext);

    const [nom, setNom] = useState("");
    const [forfait, setForfait] = useState("gratuit");
    const [chargement, setChargement] = useState(true);
    const [erreurChargement, setErreurChargement] = useState("");

    const [messageInfos, setMessageInfos] = useState("");
    const [erreurInfos, setErreurInfos] = useState("");
    const [messageMdp, setMessageMdp] = useState("");
    const [erreurMdp, setErreurMdp] = useState("");

    //charger le compte (GET /api/users/:email) et l'abonnement
    useEffect(() => {
        let annule = false;
        const charger = async () => {
            try {
                const utilisateur = await appelApi(`/users/${encodeURIComponent(auth.email)}`);
                const abonnement = await chargerAbonnement(auth.userId);
                if (annule) return;
                setNom(utilisateur.name);
                setForfait(forfaitDe(abonnement));
            } catch (e) {
                if (!annule) setErreurChargement(e.status ? "Impossible de charger votre compte." : MESSAGE_SERVEUR);
            } finally {
                if (!annule) setChargement(false);
            }
        };
        charger();
        return () => {
            annule = true;
        };
    }, [auth.email, auth.userId]);

    //enregistrer le nom (PUT /api/users/:email)
    const enregistrerInfos = async (event) => {
        event.preventDefault();
        setMessageInfos("");
        setErreurInfos("");

        if (!nom.trim()) {
            setErreurInfos("Le nom est requis.");
            return;
        }

        try {
            await appelApi(`/users/${encodeURIComponent(auth.email)}`, {
                methode: "PUT",
                corps: { name: nom.trim() },
            });
            setMessageInfos("Vos informations ont été enregistrées.");
        } catch (e) {
            setErreurInfos(e.status ? "L'enregistrement a échoué." : MESSAGE_SERVEUR);
        }
    };

    //changer le mot de passe
    const changerMotDePasse = async (event) => {
        event.preventDefault();
        setErreurMdp("");
        setMessageMdp("");
        const formulaire = event.target;
        const data = Object.fromEntries(new FormData(formulaire).entries());

        if (data.nouveau !== data.confirmer) {
            setErreurMdp("Les nouveaux mots de passe doivent être pareils.");
            return;
        }

        try {
            //verifier le mot de passe actuel avec la route de connexion (401 = incorrect)
            try {
                await appelApi("/users/login", {
                    methode: "POST",
                    corps: { email: auth.email, password: data.actuel },
                });
            } catch (e) {
                if (e.status === 401) {
                    setErreurMdp("Le mot de passe actuel est incorrect.");
                    return;
                }
                throw e;
            }

            await appelApi(`/users/${encodeURIComponent(auth.email)}`, {
                methode: "PUT",
                corps: { password: data.nouveau },
            });
            setMessageMdp("Votre mot de passe a été changé.");
            formulaire.reset();
        } catch (e) {
            setErreurMdp(e.status ? "Le changement de mot de passe a échoué." : MESSAGE_SERVEUR);
        }
    };

    if (chargement || erreurChargement) {
        return (
            <div className="compte">
                <h2>Mon compte</h2>
                <p className={erreurChargement ? "compte_erreur" : "compte_aide"}>
                    {erreurChargement || "Chargement de votre compte..."}
                </p>
            </div>
        );
    }

    return (
        <div className="compte">
            <h2>Mon compte</h2>

            {/* informations personnelles */}
            <section className="compte_section">
                <h3>Informations personnelles</h3>
                <form
                    className="compte_form"
                    onSubmit={enregistrerInfos}
                    onChange={() => {
                        setMessageInfos("");
                        setErreurInfos("");
                    }}
                >
                    <div className="compte_control">
                        <label htmlFor="nom">Nom</label>
                        <input
                            id="nom"
                            name="nom"
                            type="text"
                            value={nom}
                            onChange={(event) => setNom(event.target.value)}
                            required
                        />
                    </div>
                    <div className="compte_control">
                        <label htmlFor="courriel">Courriel</label>
                        <input id="courriel" type="email" value={auth.email || ""} disabled />
                        <span className="compte_aide">Le courriel sert à la connexion et ne peut pas être modifié.</span>
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
                        <p className="compte_forfait">{forfait === "premium" ? "Forfait Premium" : "Forfait Gratuit"}</p>
                        <p className="compte_aide">{forfait === "premium" ? "Notes illimitées" : "Jusqu'à 10 notes"}</p>
                    </div>
                    <Link to="/abonnement" className="compte_bouton compte_bouton_contour">
                        Gérer mon abonnement
                    </Link>
                </div>
            </section>
        </div>
    );
}