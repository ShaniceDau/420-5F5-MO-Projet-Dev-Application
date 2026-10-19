import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../../context/AuthContext";
import "./NavLinks.css";

const AdminNavLinks = () => {
    const { t } = useTranslation();
    const auth = useContext(AuthContext);

    return (
        <ul className="nav-links">
            <li>
                <NavLink to="/admin" end>{t("nav.accueil")}</NavLink>
            </li>
            {/* liens vers les autres pages admin */}
            <li>
                <button type="button" className="logout-link" onClick={auth.logout}>
                    {t("nav.deconnexion")}
                </button>
            </li>
        </ul>
    );
};

export default AdminNavLinks;