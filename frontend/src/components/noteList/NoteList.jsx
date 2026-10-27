import { useState } from "react";
import { Link } from "react-router-dom";
import NoteCard from "../noteCard/NoteCard";
import "./NoteList.css";

//section Mes notes
export default function NoteList({ items }) {
    const [recherche, setRecherche] = useState("");

    //filtrer selon le titre ou contenu
    const notesAffichees = items.filter((note) =>
        (note.titre + " " + note.contenu).toLowerCase().includes(recherche.toLowerCase())
    );

    return (
        <div className="mes_notes">
            <div className="mes_notes_barre">
                <input
                    type="search"
                    className="mes_notes_recherche"
                    placeholder="Rechercher une note..."
                    value={recherche}
                    onChange={(event) => setRecherche(event.target.value)}
                />
                <Link to="/newNote" className="mes_notes_nouvelle">
                    + Nouvelle note
                </Link>
            </div>

            <h2 className="mes_notes_titre">Mes notes</h2>

            {notesAffichees.length === 0 ? (
                <p className="note_list_vide">Aucune note pour l'instant.</p>
            ) : (
                <ul className="note_list">
                    {notesAffichees.map((note) => (
                        <NoteCard
                            key={note.id}
                            titre={note.titre}
                            contenu={note.contenu}
                            etiquette={note.etiquette}
                        />
                    ))}
                </ul>
            )}
        </div>
    );
}