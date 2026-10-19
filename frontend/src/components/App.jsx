import { useState } from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import RootLayout from "../containers/Roots";
import ErrorPage from "../containers/ErrorPage";
import Auth from "../containers/Auth";
import AdminAuth from "../containers/AdminAuth";
import Subscribe from "../containers/Subscribre";
import Accueil from "../containers/Accueil";
import AccueilAdmin from "../containers/AccueilAdmin";
import AdminNavigation from "./navigation/AdminNavigation";

const App = () => {
    //recuperer les donnees de l'utilisateur stockees au chargement de la page
    const storedIdUtilisateur = localStorage.getItem("idUtilisateur");
    const storedCourrielUtilisateur = localStorage.getItem("courrielUtilisateur");
    const storedRoleUtilisateur = localStorage.getItem("roleUtilisateur");

    //etats globaux de l'utilisateur connecte
    const [isLoggedIn, setIsLoggedIn] = useState(!!storedIdUtilisateur);
    const [idUtilisateur, setIdUtilisateur] = useState(storedIdUtilisateur);
    const [courrielUtilisateur, setCourrielUtilisateur] = useState(storedCourrielUtilisateur);
    const [roleUtilisateur, setRoleUtilisateur] = useState(storedRoleUtilisateur);

    //fonction de connexion, met a jour l'etat et sauvegarde dans le localStorage
    const login = (userId, email, role) => {
        setIsLoggedIn(true);
        setIdUtilisateur(userId);
        setCourrielUtilisateur(email);
        setRoleUtilisateur(role);
        localStorage.setItem("idUtilisateur", userId);
        localStorage.setItem("courrielUtilisateur", email);
        localStorage.setItem("roleUtilisateur", role);
    };

    //fonction de deconnexion, reinitialise l'etat et supprime du localStorage
    const logout = () => {
        setIsLoggedIn(false);
        setIdUtilisateur(null);
        setCourrielUtilisateur(null);
        setRoleUtilisateur(null);
        localStorage.removeItem("idUtilisateur");
        localStorage.removeItem("courrielUtilisateur");
        localStorage.removeItem("roleUtilisateur");
    };

    //Router public non connectes
    const routerLoggedIn = createBrowserRouter([
        {
            path: "/",
            element: <RootLayout />,
            errorElement: <ErrorPage />,
            children: [
                { index: true, element: <Navigate to="/login" replace /> },
                { path: "login", element: <Auth /> },
                { path: "register", element: <Subscribe /> },
            ],
        },
        //connexion admin : aucun lien n'y mene, l'admin doit ecrire l'URL
        { path: "/admin/login", element: <AdminAuth /> },
        //toute autre route /admin renvoie vers la connexion admin
        { path: "/admin/*", element: <Navigate to="/admin/login" replace /> },
        //toute route inconnue renvoie vers la connexion
        { path: "*", element: <Navigate to="/login" replace /> },
    ]);

    //Router protege - utilisateurs connectes (utilisateurs et admin)
    const routerNotLoggedIn = createBrowserRouter([
        //pages des utilisateurs
        {
            path: "/",
            element: <RootLayout />,
            errorElement: <ErrorPage />,
            children: [
                { index: true, element: <Accueil /> },
                //ajouter ici les autres pages des utilisateurs
            ],
        },
        //pages de l'admin 
        {
            path: "/admin",
            element: <AdminNavigation />,
            errorElement: <ErrorPage />,
            children: [
                { index: true, element: <AccueilAdmin /> },
                //ajouter ici les autres pages de l'admin
            ],
        },
        //toute route inconnue 
        {
            path: "*",
            element: <Navigate to={roleUtilisateur === "admin" ? "/admin" : "/"} replace />,
        },
    ]);

    const authContextValue = {
        loggedIn: isLoggedIn,
        userId: idUtilisateur,
        email: courrielUtilisateur,
        role: roleUtilisateur,
        login: login,
        logout: logout,
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            {}
            {}
            <RouterProvider
                key={isLoggedIn ? "protege" : "public"}
                router={isLoggedIn ? routerNotLoggedIn : routerLoggedIn}
            />
        </AuthContext.Provider>
    );
};

export default App;