import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import NoteList from "../components/noteList/NoteList";

//les notes que d'autres utilisateurs ont partagees avec moi
const Partagees = () => {
    const auth = useContext(AuthContext);

    const notes = JSON.parse(localStorage.getItem("notes")) || [];
    const utilisateurs = JSON.parse(localStorage.getItem("utilisateurs")) || [];

    //les notes des autres partagees avec moi, avec le nom de la personne qui l'a partagee
    const notesPartagees = notes
        .filter((note) => note.partageAvec && note.partageAvec.includes(auth.email))
        .map((note) => {
            const proprietaire = utilisateurs.find((u) => u.id === note.userId);
            return { ...note, etiquette: "De " + (proprietaire ? proprietaire.email : "inconnu") };
        });

    return (
        <NoteList
            items={notesPartagees}
            titre="Partagées avec moi"
            messageVide="Personne ne vous a partagé de note pour l'instant."
        />
    );
};

export default Partagees;