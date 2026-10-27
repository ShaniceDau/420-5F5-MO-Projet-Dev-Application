import NavLinks from "./NavLinks";
import "./MainNavigation.css";

const MainNavigation = () => {
    return (
        <header className="main-header">
            <nav className="main-navigation__header-nav">
                <NavLinks />
            </nav>
        </header>
    );
};

export default MainNavigation;