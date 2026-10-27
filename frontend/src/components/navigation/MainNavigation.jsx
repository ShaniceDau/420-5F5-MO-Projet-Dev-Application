import NavLinks from "./NavLinks";
import SideDrawer from "./SideDrawer";
import "./MainNavigation.css";
import Backdrop from "../UIElements/Backdrop";
import { useState } from "react";

const MainNavigation = () => {
    const [drawerIsOpen, setDrawerIsOpen] = useState(false);

    //ouvre le menu sur cellulaire
    const openDrawer = () => {
        setDrawerIsOpen(true);
    };

    //ferme le menu 
    const closeDrawer = () => {
        setDrawerIsOpen(false);
    };

    return (
        <>
            {/* cellulaire  */}
            {drawerIsOpen && <Backdrop onClick={closeDrawer} />}
            {drawerIsOpen && (
                <SideDrawer onClick={closeDrawer}>
                    <nav className="main-navigation_MenuDrawer">
                        <NavLinks />
                    </nav>
                </SideDrawer>
            )}

            {/* ordinateur : menu a gauche, cellulaire : barre en haut avec hamburger */}
            <header className="main-header">
                <button className="main-navigation_MenuButton" onClick={openDrawer}>
                    <span />
                    <span />
                    <span />
                </button>
                <h1 className="main-navigation__title">Nota</h1>
                <nav className="main-navigation__header-nav">
                    <NavLinks />
                </nav>
            </header>
        </>
    );
};

export default MainNavigation;