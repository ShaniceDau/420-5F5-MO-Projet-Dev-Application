import { useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./NoteDetails.css";

//formulaire d'une note
export default function NoteDetails() {
    const auth = useContext(AuthContext);
    const { noteId } = useParams();
    const navigate = useNavigate();

    const notes = JSON.parse(localStorage.getItem("notes")) || [];
    const modeModification = noteId !== undefined;

    //chercher la note seulement si elle appartient a l'utilisateur connecte
    const note = notes.find((n) => n.id === noteId && n.userId === auth.userId);

    if (modeModification && !note) {
        return (
            <div className="note_details">
                <h2>Note introuvable</h2>
                <Link to="/mes-notes">Retour à mes notes</Link>
            </div>
        );
    }

    const sauvegarder = (event) => {
        event.preventDefault();
        const fd = new FormData(event.target);
        const data = Object.fromEntries(fd.entries());

        let nouvellesNotes;
        if (modeModification) {
            //remplacer la note modifiee
            nouvellesNotes = notes.map((n) =>
                n.id === noteId ? { ...n, titre: data.titre, contenu: data.contenu } : n
            );
        } else {
            //ajouter une nouvelle note
            const nouvelleNote = {
                id: "n" + Date.now(),
                userId: auth.userId,
                titre: data.titre,
                contenu: data.contenu,
            };
            nouvellesNotes = [...notes, nouvelleNote];
        }

        localStorage.setItem("notes", JSON.stringify(nouvellesNotes));
        navigate("/mes-notes");
    };

    const supprimer = () => {
        if (!window.confirm("Supprimer cette note ?")) return;
        const nouvellesNotes = notes.filter((n) => n.id !== noteId);
        localStorage.setItem("notes", JSON.stringify(nouvellesNotes));
        navigate("/mes-notes");
    };

    return (
        <div className="note_details">
            <h2>{modeModification ? "Modifier la note" : "Nouvelle note"}</h2>

            <form className="note_form" onSubmit={sauvegarder} key={noteId || "nouvelle"}>
                <div className="note_form_control">
                    <label htmlFor="titre">Titre</label>
                    <input id="titre" name="titre" type="text" defaultValue={note?.titre} required />
                </div>

                <div className="note_form_control">
                    <label htmlFor="contenu">Contenu</label>
                    <textarea id="contenu" name="contenu" rows="10" defaultValue={note?.contenu} />
                </div>

                <div className="note_form_actions">
                    <Link to="/noteCards" className="note_form_bouton note_form_bouton_contour">
                        Annuler
                    </Link>
                    {modeModification && (
                        <button type="button" className="note_form_bouton note_form_bouton_contour" onClick={supprimer}>
                            Supprimer
                        </button>
                    )}
                    <button type="submit" className="note_form_bouton note_form_bouton_plein">
                        Enregistrer
                    </button>
                </div>
            </form>
        </div>
    );
}