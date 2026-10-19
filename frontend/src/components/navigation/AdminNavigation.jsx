import { Outlet, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import AdminNavLinks from "./AdminNavLinks";
import LanguageSwitcher from "../languageSwitcher/LaguageSwitcher";
import "./MainNavigation.css";

//mise en page de la zone admin : menu admin + page courante
export default function AdminNavigation() {
    const auth = useContext(AuthContext);

    //un utilisateur connecte qui n'est pas admin est renvoye vers son accueil
    if (auth.role !== "admin") {
        return <Navigate to="/" replace />;
    }

    return (
        <>
            <header className="main-header">
                <span className="main-navigation__title">Administration</span>
                <nav className="main-navigation__header-nav">
                    <AdminNavLinks />
                </nav>
                <LanguageSwitcher />
            </header>
            <main>
                <Outlet />
            </main>
        </>
    );
}