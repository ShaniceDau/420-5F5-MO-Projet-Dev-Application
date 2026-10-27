import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./NavLinks.css";

const AdminNavLinks = () => {
    const auth = useContext(AuthContext);

    return (
        <ul className="nav-links">
            <li>
                <NavLink to="/admin" end>Accueil</NavLink>
            </li>
            {/* ajouter ici les liens vers les autres pages admin */}
            <li>
                <NavLink to="/admin/login" onClick={auth.logout}>Déconnexion</NavLink>
            </li>
        </ul>
    );
};

export default AdminNavLinks;