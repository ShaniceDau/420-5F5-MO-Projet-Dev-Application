import { AuthContext } from "../../context/AuthContext";
import "./LoginForm.css";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";

const ADMIN = { id: "admin", email: "admin@nota.com", password: "admin123", role: "admin" };

//admin = true : formulaire de /admin/login (seul l'admin peut s'y connecter)
//admin = false : formulaire de /login (seuls les utilisateurs inscrits peuvent s'y connecter)
export default function LoginForm({ admin = false }) {
    const [emailVide, setEmailVide] = useState(false);
    const [mdpVide, setMdpVide] = useState(false);
    const [erreurConnexion, setErreurConnexion] = useState(false);

    const auth = useContext(AuthContext);

    const reinitialiserErreurs = () => {
        setEmailVide(false);
        setMdpVide(false);
        setErreurConnexion(false);
    };

    const authSubmitHandler = (event) => {
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

        //l'admin se connecte seulement sur /admin/login, les utilisateurs seulement sur /login
        const comptes = admin
            ? [ADMIN]
            : JSON.parse(localStorage.getItem("utilisateurs")) || [];
        const trouve = comptes.find(
            (u) => u.email === data.email && u.password === data.password
        );

        if (!trouve) {
            setErreurConnexion(true);
            return;
        }

        //App change de routeur selon le role, et ce routeur redirige vers la bonne page
        auth.login(trouve.id, trouve.email, admin ? "admin" : "user");
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