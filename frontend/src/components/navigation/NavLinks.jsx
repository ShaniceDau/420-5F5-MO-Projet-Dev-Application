import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./NavLinks.css";

//liens du menu de gauche
const NavLinks = () => {
    const auth = useContext(AuthContext);

    return (
        <ul className="nav-links">
            <li><NavLink to="/mes-notes">Mes notes</NavLink></li>
            <li><NavLink to="/partager">Partage</NavLink></li>
            <li><NavLink to="/abonnement">Abonnement</NavLink></li>
            <li><NavLink to="/compte">Mon compte</NavLink></li>
            <li className="nav-links_deconnexion">
                <NavLink to="/login" onClick={auth.logout}>Déconnexion</NavLink>
            </li>
        </ul>
    );
};

export default NavLinks;