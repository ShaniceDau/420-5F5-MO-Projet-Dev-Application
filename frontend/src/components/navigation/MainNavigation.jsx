import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import NavLinks from "./NavLinks";
import "./MainNavigation.css";

const MainNavigation = () => {

    const auth = useContext(AuthContext);

    if (!auth.loggedIn) {
        return <Navigate to="/login" replace />;
    }

    return (
        <>
            <nav className="main-navigation_MenuDrawer">
                <NavLinks />
            </nav>
                
            <header className="main-header">
                <nav className="main-navigation__header-nav">
                    <NavLinks />
                </nav>
            </header>
        </>
    );
};

export default MainNavigation;