import "./NoteCard.css";

export default function NoteCard({ titre, contenu, etiquette }) {
    return (
        <li className="note_card">
            <h3 className="note_card_titre">{titre}</h3>
            <p className="note_card_contenu">{contenu}</p>
            {etiquette && <span className="note_card_etiquette">{etiquette}</span>}
        </li>
    );
}