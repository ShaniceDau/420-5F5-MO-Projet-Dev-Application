import NavLinks from "./NavLinks";
import "./MainNavigation.css";

const MainNavigation = () => {

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