import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import NoteList from "../components/noteList/NoteList";
import { appelApi, MESSAGE_SERVEUR } from "../api";

//les notes de l'utilisateur connecte, venant du backend
const Cards = () => {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    const [notes, setNotes] = useState([]);
    const [message, setMessage] = useState("Chargement des notes...");

    useEffect(() => {
        let annule = false;

        //GET /api/notes renvoie toutes les notes : on garde celles de l'utilisateur connecte
        appelApi("/notes")
            .then((toutes) => {
                if (annule) return;
                const miennes = toutes
                    .filter((note) => note.userId === auth.userId)
                    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                    .map((note) => ({ id: note._id, titre: note.title, contenu: note.content }));
                setNotes(miennes);
                setMessage("Aucune note pour l'instant.");
            })
            .catch((erreur) => {
                if (!annule) setMessage(erreur.status ? "Impossible de charger les notes." : MESSAGE_SERVEUR);
            });

        return () => {
            annule = true;
        };
    }, [auth.userId]);

    //Nouvelle note : ouvre l'editeur vide, la note est creee des qu'elle a un titre et du contenu
    const ajouterNote = () => navigate("/notes/nouvelle");

    return <NoteList items={notes} onAjouter={ajouterNote} messageVide={message} />;
};

export default Cards;