import { Outlet, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import AdminNavLinks from "./AdminNavLinks";
import "./MainNavigation.css";
import "./AdminNavigation.css";

export default function AdminNavigation() {
    const auth = useContext(AuthContext);

    //un utilisateur connecte qui n'est pas admin est renvoye vers ses notes
    if (auth.role !== "admin") {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="admin_layout">
            <header className="main-header">
                <span className="main-navigation__title">Administration</span>
                <nav className="main-navigation__header-nav">
                    <AdminNavLinks />
                </nav>
            </header>
            <main className="admin_contenu">
                <Outlet />
            </main>
        </div>
    );
}