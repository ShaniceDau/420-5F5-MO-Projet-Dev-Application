import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

//page temporaire affichee apres la connexion d'un utilisateur
export default function Accueil() {
    const auth = useContext(AuthContext);

    return (
        <div>
            <h2>Bienvenue !</h2>
            <p>Vous êtes connecté avec {auth.email}.</p>
        </div>
    );
}