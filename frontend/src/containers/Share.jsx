import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import NoteList from "../components/noteList/NoteList";
import { appelApi, MESSAGE_SERVEUR } from "../api";

//les notes que d'autres utilisateurs ont partagees avec moi
const Partagees = () => {
    const auth = useContext(AuthContext);

    const [notes, setNotes] = useState([]);
    const [message, setMessage] = useState("Chargement des notes partagées...");

    useEffect(() => {
        let annule = false;

        //GET /api/partages renvoie chaque partage avec la note et les deux utilisateurs
        appelApi("/partages")
            .then((partages) => {
                if (annule) return;
                const avecMoi = partages
                    .filter((p) => p.noteId && p.sharedWith && p.sharedWith._id === auth.userId)
                    .map((p) => ({
                        id: p.noteId._id,
                        titre: p.noteId.title,
                        contenu: p.noteId.content,
                        etiquette: "De " + (p.sharedBy ? p.sharedBy.email : "inconnu"),
                    }));
                setNotes(avecMoi);
                setMessage("Personne ne vous a partagé de note pour l'instant.");
            })
            .catch((erreur) => {
                if (!annule) setMessage(erreur.status ? "Impossible de charger les notes partagées." : MESSAGE_SERVEUR);
            });

        return () => {
            annule = true;
        };
    }, [auth.userId]);

    return <NoteList items={notes} titre="Partagées avec moi" messageVide={message} />;
};

export default Partagees;