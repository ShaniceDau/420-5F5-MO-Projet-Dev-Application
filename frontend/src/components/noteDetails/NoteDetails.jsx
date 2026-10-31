import { useContext, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./NoteDetails.css";

//formulaire d'une note
export default function NoteDetails() {
    const auth = useContext(AuthContext);
    const { noteId } = useParams();
    const navigate = useNavigate();

    const notes = JSON.parse(localStorage.getItem("notes")) || [];

    //chercher la note seulement si elle appartient a l'utilisateur connecte
    const note = notes.find((n) => n.id === noteId && n.userId === auth.userId);

    const [titre, setTitre] = useState(note ? note.titre : "");
    const [contenu, setContenu] = useState(note ? note.contenu : "");

    if (!note) {
        return (
            <div className="note_editeur">
                <h2>Note introuvable</h2>
                <Link to="/mes-notes">Retour à mes notes</Link>
            </div>
        );
    }

    //enregistrer la note dans le localStorage
    const enregistrer = (nouveauTitre, nouveauContenu) => {
        const toutes = JSON.parse(localStorage.getItem("notes")) || [];
        const misesAJour = toutes.map((n) =>
            n.id === noteId ? { ...n, titre: nouveauTitre, contenu: nouveauContenu } : n
        );
        localStorage.setItem("notes", JSON.stringify(misesAJour));
    };

    const changerTitre = (event) => {
        setTitre(event.target.value);
        enregistrer(event.target.value, contenu);
    };

    const changerContenu = (event) => {
        setContenu(event.target.value);
        enregistrer(titre, event.target.value);
    };

    const supprimer = () => {
        if (!window.confirm("Supprimer cette note ?")) return;
        const toutes = JSON.parse(localStorage.getItem("notes")) || [];
        localStorage.setItem("notes", JSON.stringify(toutes.filter((n) => n.id !== noteId)));
        navigate("/mes-notes");
    };

    return (
        <div className="note_editeur">
            <div className="note_editeur_barre">
                <Link to="/mes-notes" className="note_editeur_retour">Mes notes</Link>
                <span className="note_editeur_statut">Enregistré automatiquement</span>
                <button type="button" className="note_editeur_supprimer" onClick={supprimer}>
                    Supprimer
                </button>
            </div>

            <input
                className="note_editeur_titre"
                type="text"
                placeholder="Titre de la note"
                value={titre}
                onChange={changerTitre}
                autoFocus={titre === ""}
            />

            <textarea
                className="note_editeur_contenu"
                placeholder="Commencez à écrire..."
                value={contenu}
                onChange={changerContenu}
            />
        </div>
    );
}