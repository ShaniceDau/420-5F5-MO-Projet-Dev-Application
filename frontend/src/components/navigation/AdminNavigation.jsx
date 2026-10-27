import { Outlet, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import AdminNavLinks from "./AdminNavLinks";
import LanguageSwitcher from "../languageSwitcher/LaguageSwitcher";
import "./MainNavigation.css";

export default function AdminNavigation() {
    const auth = useContext(AuthContext);

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