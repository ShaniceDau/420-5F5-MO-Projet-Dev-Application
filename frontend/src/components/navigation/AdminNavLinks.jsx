import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./NavLinks.css";

const AdminNavLinks = () => {
    const auth = useContext(AuthContext);

    return (
        <ul className="nav-links">
            <li>
                <NavLink to="/admin/login" end></NavLink>
            </li>
            <li>
                <NavLink to="/admin/utilisateurs"></NavLink>
            </li>
            <li>
                <NavLink to="/admin/compte"></NavLink>
            </li>
            <li className="logout-link">
                <NavLink to="/" onClick={auth.logout}></NavLink>
            </li>
        </ul>
    );
};

export default AdminNavLinks;