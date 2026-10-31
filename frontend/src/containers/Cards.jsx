import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import NoteList from "../components/noteList/NoteList";

const Cards = () => {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    //notes sauvegardees dans le localStorage, on garde seulement celles de l'utilisateur connecte
    const notes = JSON.parse(localStorage.getItem("notes")) || [];
    const mesNotes = notes.filter((note) => note.userId === auth.userId);

    //cree une note vide et l'ouvre tout de suite
    const ajouterNote = () => {
        const nouvelleNote = {
            id: "n" + Date.now(),
            userId: auth.userId,
            titre: "",
            contenu: "",
        };
        localStorage.setItem("notes", JSON.stringify([...notes, nouvelleNote]));
        navigate(`/notes/${nouvelleNote.id}`);
    };

    return <NoteList items={mesNotes} onAjouter={ajouterNote} />;
};

export default Cards;