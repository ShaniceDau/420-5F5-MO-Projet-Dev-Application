import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import NoteList from "../components/noteList/NoteList";

const Cards = () => {
    const auth = useContext(AuthContext);

    //notes sauvegardees dans le localStorage, on garde seulement celles de l'utilisateur connecte
    const notes = JSON.parse(localStorage.getItem("notes")) || [];
    const mesNotes = notes.filter((note) => note.userId === auth.userId);

    return <NoteList items={mesNotes} />;
};

export default Cards;