import { useState } from "react";
import { Link } from "react-router-dom";
import "./Subscription.css";

export default function Abonnement() {
    const [forfait, setForfait] = useState("gratuit");

    return (
        <div className="abonnement">
            <h2>Abonnement</h2>
            <p className="abonnement_utilisation">Choisissez le forfait qui vous convient.</p>

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
                            onClick={() => setForfait("gratuit")}
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