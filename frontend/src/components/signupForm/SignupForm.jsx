import { useState } from "react";
import "./SignupForm.css";
import { useNavigate, Link } from "react-router-dom";
import { appelApi, MESSAGE_SERVEUR } from "../../api";

export default function Signup() {
    const [passwordNotEqual, setPasswordNotEqual] = useState(false);
    const [emailExiste, setEmailExiste] = useState(false);
    const [erreur, setErreur] = useState("");
    const navigate = useNavigate();

    async function handleSubmit(event) {
        event.preventDefault();
        const fd = new FormData(event.target);
        const data = Object.fromEntries(fd.entries());

        setPasswordNotEqual(false);
        setEmailExiste(false);
        setErreur("");

        if (data.password !== data["confirmez-mdp"]) {
            setPasswordNotEqual(true);
            return;
        }

        //le backend a un seul champ "name" : on y met le prenom et le nom
        const name =
            `${data["first-name"] || ""} ${data["last-name"] || ""}`.trim() || data.courriel.split("@")[0];

        try {
            //POST /api/users/register
            await appelApi("/users/register", {
                methode: "POST",
                corps: { name, email: data.courriel, password: data.password },
            });

            //Rediriger vers la page de connexion après l'inscription
            navigate("/login");
        } catch (e) {
            if (e.status === 400) {
                //"User already exists"
                setEmailExiste(true);
            } else if (e.status) {
                setErreur("L'inscription a échoué. Vérifiez le courriel et réessayez.");
            } else {
                setErreur(MESSAGE_SERVEUR);
            }
        }
    }

    const handleReset = () => {
        setPasswordNotEqual(false);
        setEmailExiste(false);
        setErreur("");
    };

    return (
        <div className="auth_container">
            <form className="form" onSubmit={handleSubmit} onReset={handleReset}>
                <h2 className="title">Bienvenue !</h2>
                <p className="subtitle">Nous avons besoin de vos informations pour commencer.</p>

                <div className="control">
                    <label htmlFor="email">Courriel </label>
                    <input id="email" type="email" name="courriel" required />
                    {emailExiste && <div className="erreur_msg">Ce courriel est déjà utilisé.</div>}
                </div>

                <div className="control_row">
                    <div className="control">
                        <label htmlFor="password">Mot de passe </label>
                        <input id="password" type="password" name="password" required />
                    </div>
                    <div className="control">
                        <label htmlFor="confirmez-mdp">Confirmez le mot de passe </label>
                        <input
                            id="confirmez-mdp"
                            type="password"
                            name="confirmez-mdp"
                            required
                            className={passwordNotEqual ? "input_invalid" : ""}
                        />
                    </div>
                </div>

                {passwordNotEqual && (
                    <div className="erreur_msg">
                        <p>Les mots de passe doivent être pareils !</p>
                    </div>
                )}

                <hr className="hr_control" />

                <div className="control_row">
                    <div className="control">
                        <label htmlFor="first-name">Prénom </label>
                        <input id="first-name" type="text" name="first-name" />
                    </div>

                    <div className="control">
                        <label htmlFor="last-name">Nom </label>
                        <input id="last-name" type="text" name="last-name" />
                    </div>
                </div>

                {erreur && (
                    <div className="erreur_msg">
                        <p>{erreur}</p>
                    </div>
                )}

                <p className="btn_actions">
                    <button type="reset" className="button button_outline">Réinitialiser</button>
                    <button type="submit" className="button button_submit">S'inscrire</button>
                </p>

                <p className="lien_connexion">
                    Déjà un compte ? <Link to="/login">Connectez-vous</Link>
                </p>
            </form>
        </div>
    );
}