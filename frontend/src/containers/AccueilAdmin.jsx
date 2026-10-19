import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

//page temporaire affichee apres la connexion de l'admin
export default function AccueilAdmin() {
    const auth = useContext(AuthContext);

    return (
        <div>
            <h2>Tableau de bord administrateur</h2>
            <p>Vous êtes connecté avec {auth.email}.</p>
        </div>
    );
}