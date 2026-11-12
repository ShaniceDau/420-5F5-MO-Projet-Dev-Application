import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { MESSAGE_SERVEUR } from "../api";
import { chargerAbonnement, forfaitDe, revenirGratuit } from "../util/abonnements";
import "./Subscription.css";

//le forfait actuel vient du backend (/api/abonnements)
export default function Abonnement() {
    const auth = useContext(AuthContext);

    const [abonnement, setAbonnement] = useState(null);
    const [chargement, setChargement] = useState(true);
    const [erreur, setErreur] = useState("");

    const forfait = forfaitDe(abonnement);

    useEffect(() => {
        let annule = false;
        chargerAbonnement(auth.userId)
            .then((a) => {
                if (!annule) setAbonnement(a);
            })
            .catch((e) => {
                if (!annule) setErreur(e.status ? "Impossible de charger votre abonnement." : MESSAGE_SERVEUR);
            })
            .finally(() => {
                if (!annule) setChargement(false);
            });
        return () => {
            annule = true;
        };
    }, [auth.userId]);

    //annuler le premium : le compte repasse au forfait gratuit
    const annulerPremium = async () => {
        if (!window.confirm("Revenir au forfait gratuit ? Vous ne pourrez plus créer de note au-delà de 10.")) return;
        setErreur("");
        try {
            setAbonnement(await revenirGratuit(abonnement));
        } catch (e) {
            setErreur(e.status ? "Le changement de forfait a échoué." : MESSAGE_SERVEUR);
        }
    };

    if (chargement) {
        return (
            <div className="abonnement">
                <h2>Abonnement</h2>
                <p className="abonnement_utilisation">Chargement de votre abonnement...</p>
            </div>
        );
    }

    return (
        <div className="abonnement">
            <h2>Abonnement</h2>
            <p className="abonnement_utilisation">
                {forfait === "premium" ? "Vous avez le forfait Premium." : "Choisissez le forfait qui vous convient."}
            </p>
            {erreur && <p className="abonnement_erreur">{erreur}</p>}

            <div className="abonnement_forfaits">
                {/* forfait gratuit */}
                <div className={`forfait ${forfait === "gratuit" ? "forfait_actuel" : ""}`}>
                    {forfait === "gratuit" && <span className="forfait_badge">Forfait actuel</span>}
                    <h3>Gratuit</h3>
                    <p className="forfait_prix">0 $<span> / mois</span></p>
                    <ul>
                        <li>Jusqu'à 10 notes</li>
                        <li>Partage de notes</li>
                        <li>Enregistrement automatique</li>
                    </ul>
                    {forfait === "premium" && (
                        <button
                            type="button"
                            className="forfait_bouton forfait_bouton_contour"
                            onClick={annulerPremium}
                        >
                            Revenir au gratuit
                        </button>
                    )}
                </div>

                {/* forfait premium */}
                <div className={`forfait ${forfait === "premium" ? "forfait_actuel" : ""}`}>
                    {forfait === "premium" && <span className="forfait_badge">Forfait actuel</span>}
                    <h3>Premium</h3>
                    <p className="forfait_prix">4,99 $<span> / mois</span></p>
                    <ul>
                        <li>Notes illimitées</li>
                        <li>Partage de notes</li>
                        <li>Enregistrement automatique</li>
                    </ul>
                    {forfait === "gratuit" && (
                        //mene a la page de paiement
                        <Link to="/paiement" className="forfait_bouton forfait_bouton_plein">
                            Passer à Premium
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}