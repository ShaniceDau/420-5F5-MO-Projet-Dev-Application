import { useState } from "react";
import { Link } from "react-router-dom";
import "./Paiement.css"

export default function Paiement() {
    const [numeroCarte, setNumeroCarte] = useState("");
    const [expiration, setExpiration] = useState("");
    const [paye, setPaye] = useState(false);

    //chiffre de carte credit
    const changerNumero = (event) => {
        const chiffres = event.target.value.replace(/\D/g, "").slice(0, 16);
        setNumeroCarte(chiffres.replace(/(\d{4})(?=\d)/g, "$1 "));
    };

    //date
    const changerExpiration = (event) => {
        const chiffres = event.target.value.replace(/\D/g, "").slice(0, 4);
        setExpiration(chiffres.length > 2 ? chiffres.slice(0, 2) + "/" + chiffres.slice(2) : chiffres);
    };

    const payer = (event) => {
        event.preventDefault();
        //envoyer la demande de paiement au backend ici
        setPaye(true);
    };

    //ecran de confirmation
    if (paye) {
        return (
            <div className="paiement paiement_confirmation">
                <h2>Merci !</h2>
                <p>Votre abonnement Premium est activé. Vous pouvez maintenant créer des notes illimitées.</p>
                <Link to="/mes-notes" className="paiement_bouton">Retour à mes notes</Link>
            </div>
        );
    }

    return (
        <div className="paiement">
            <Link to="/abonnement" className="paiement_retour">Abonnement</Link>
            <h2>Paiement</h2>

            <div className="paiement_contenu">
                {/* recapitulatif de la commande */}
                <aside className="paiement_recap">
                    <h3>Votre commande</h3>
                    <div className="paiement_ligne">
                        <span>Nota Premium (mensuel)</span>
                        <span>4,99 $</span>
                    </div>
                    <div className="paiement_ligne paiement_total">
                        <span>Total aujourd'hui</span>
                        <span>4,99 $</span>
                    </div>
                    <p className="paiement_note">Renouvelé chaque mois. Annulable en tout temps.</p>
                </aside>

                {/* formulaire de carte */}
                <form className="paiement_form" onSubmit={payer}>
                    <div className="paiement_control">
                        <label htmlFor="nom">Nom sur la carte</label>
                        <input id="nom" name="nom" type="text" autoComplete="cc-name" required />
                    </div>

                    <div className="paiement_control">
                        <label htmlFor="numero">Numéro de carte</label>
                        <input
                            id="numero"
                            name="numero"
                            type="text"
                            inputMode="numeric"
                            autoComplete="cc-number"
                            placeholder="1234 5678 9012 3456"
                            value={numeroCarte}
                            onChange={changerNumero}
                            pattern="\d{4} \d{4} \d{4} \d{4}"
                            title="16 chiffres"
                            required
                        />
                    </div>

                    <div className="paiement_rangee">
                        <div className="paiement_control">
                            <label htmlFor="expiration">Expiration</label>
                            <input
                                id="expiration"
                                name="expiration"
                                type="text"
                                inputMode="numeric"
                                autoComplete="cc-exp"
                                placeholder="MM/AA"
                                value={expiration}
                                onChange={changerExpiration}
                                pattern="(0[1-9]|1[0-2])/\d{2}"
                                title="Format MM/AA"
                                required
                            />
                        </div>
                        <div className="paiement_control">
                            <label htmlFor="cvc">CVC</label>
                            <input
                                id="cvc"
                                name="cvc"
                                type="text"
                                inputMode="numeric"
                                autoComplete="cc-csc"
                                placeholder="123"
                                maxLength="4"
                                pattern="\d{3,4}"
                                title="3 ou 4 chiffres"
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="paiement_bouton">Payer 4,99 $</button>
                </form>
            </div>
        </div>
    );
}