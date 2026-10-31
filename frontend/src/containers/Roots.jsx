import { Outlet } from "react-router-dom";
import MainNavigation from "../components/navigation/MainNavigation";
import "./Roots.css";

export default function RootLayout() {
    return (
        <div className="layout">
            <MainNavigation />
            <main className="layout_contenu">
                <Outlet />
            </main>
        </div>
    );
}