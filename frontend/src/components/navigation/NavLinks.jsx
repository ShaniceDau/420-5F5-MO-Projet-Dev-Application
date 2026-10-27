import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./NavLinks.css";

const NavLinks = () => {
    const auth = useContext(AuthContext);
    
    return (
        <ul className="nav-links">
            <li>
                <NavLink to="/" end>Accueil</NavLink>
            </li>
            <li>
                <NavLink to="/login" onClick={auth.logout}>Déconnexion</NavLink>
            </li>
        </ul>
    );
};

export default NavLinks;