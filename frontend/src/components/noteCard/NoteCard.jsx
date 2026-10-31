import { Link } from "react-router-dom";
import "./NoteCard.css";

//un clic ouvre la note en grand
export default function NoteCard({ id, titre, contenu, etiquette }) {
    return (
        <li>
            <Link to={`/notes/${id}`} className="note_card">
                <h3 className="note_card_titre">{titre || "Sans titre"}</h3>
                <p className="note_card_contenu">{contenu}</p>
                {etiquette && <span className="note_card_etiquette">{etiquette}</span>}
            </Link>
        </li>
    );
}