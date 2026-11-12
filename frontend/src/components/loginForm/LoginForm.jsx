import { AuthContext } from "../../context/AuthContext";
import "./LoginForm.css";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { appelApi, MESSAGE_SERVEUR } from "../../api";

//admin = true : formulaire de /admin/login (seul l'admin peut s'y connecter)
//admin = false : formulaire de /login (seuls les utilisateurs inscrits peuvent s'y connecter)
export default function LoginForm({ admin = false }) {
    const [emailVide, setEmailVide] = useState(false);
    const [mdpVide, setMdpVide] = useState(false);
    const [erreurConnexion, setErreurConnexion] = useState(false);
    const [erreurServeur, setErreurServeur] = useState(false);

    const auth = useContext(AuthContext);

    const reinitialiserErreurs = () => {
        setEmailVide(false);
        setMdpVide(false);
        setErreurConnexion(false);
        setErreurServeur(false);
    };

    const authSubmitHandler = async (event) => {
        event.preventDefault();
        const fd = new FormData(event.target);
        const data = Object.fromEntries(fd.entries());

        reinitialiserErreurs();

        let valid = true;
        if (!data.email) {
            setEmailVide(true);
            valid = false;
        }
        if (!data.password) {
            setMdpVide(true);
            valid = false;
        }
        if (!valid) return;

        const identifiants = { email: data.email.trim().toLowerCase(), password: data.password };

        try {
            if (admin) {
                //POST /api/admins/login -> { admin: { id, ... }
                const reponse = await appelApi("/admins/login", { methode: "POST", corps: identifiants });
                auth.login(reponse.admin.id, reponse.admin.email, "admin");
            } else {
                //POST /api/users/login -> { user: { _id, ...}
                const reponse = await appelApi("/users/login", { methode: "POST", corps: identifiants });
                auth.login(reponse.user._id, reponse.user.email, "user");
            }
            //App change de routeur selon le role, et ce routeur redirige vers la bonne page
        } catch (erreur) {
            //404 (compte introuvable) ou 401 (mauvais mot de passe)
            if (erreur.status) {
                setErreurConnexion(true);
            } else {
                setErreurServeur(true);
            }
        }
    };

    return (
        <div className="auth_container">
            <form className="form" onSubmit={authSubmitHandler} onReset={reinitialiserErreurs}>
                <h2 className="title">{admin ? "Connexion administrateur" : "Connexion"}</h2>

                <div className="control_row">
                    <div className="control">
                        <label htmlFor="email">Courriel </label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            className={emailVide ? "input_invalid" : ""}
                        />
                        {emailVide && <div className="erreur_msg">Le courriel est requis</div>}
                    </div>

                    <div className="control">
                        <label htmlFor="password">Mot de passe </label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            className={mdpVide ? "input_invalid" : ""}
                        />
                        {mdpVide && <div className="erreur_msg">Le mot de passe est requis</div>}
                    </div>
                </div>

                {erreurConnexion && (
                    <div className="erreur_msg">Courriel ou mot de passe incorrect</div>
                )}
                {erreurServeur && <div className="erreur_msg">{MESSAGE_SERVEUR}</div>}

                <p className="btn_actions">
                    <button type="reset" className="button button_outline">
                        Réinitialiser
                    </button>
                    <button type="submit" className="button button_submit">
                        Se connecter
                    </button>
                </p>

                {!admin && (
                    <p className="lien_inscription">
                        Pas encore de compte ? <Link to="/register">Inscrivez-vous</Link>
                    </p>
                )}
            </form>
        </div>
    );
}