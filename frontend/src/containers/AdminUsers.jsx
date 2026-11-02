import { useState } from "react";
import { Link } from "react-router-dom";
import "./AdminUsers.css";

export default function AdminUsers() {
    const [recherche, setRecherche] = useState("");

    const utilisateurs = JSON.parse(localStorage.getItem("utilisateurs")) || [];
    const notes = JSON.parse(localStorage.getItem("notes")) || [];

    const texte = recherche.trim().toLowerCase();
    const resultats = utilisateurs.filter((u) =>
        `${u.prenom || ""} ${u.nom || ""} ${u.email}`.toLowerCase().includes(texte)
    );

    return (
        <div className="admin_utilisateurs">
            <h2>Utilisateurs</h2>
            <p className="admin_utilisateurs_intro">
                Recherchez un utilisateur par son nom ou son courriel, puis sélectionnez-le pour consulter son compte.
            </p>

            <input
                type="search"
                className="admin_recherche"
                placeholder="Rechercher par nom ou courriel..."
                value={recherche}
                onChange={(event) => setRecherche(event.target.value)}
                autoFocus
            />

            <p className="admin_nb_resultats">
                {resultats.length} utilisateur{resultats.length > 1 ? "s" : ""}
                {texte && ` trouvé${resultats.length > 1 ? "s" : ""}`}
            </p>

            {resultats.length === 0 ? (
                <p className="admin_aucun">Aucun utilisateur n'a été trouvé.</p>
            ) : (
                <div className="admin_tableau_conteneur">
                    <table className="admin_tableau">
                        <thead>
                            <tr>
                                <th>Nom</th>
                                <th>Courriel</th>
                                <th>Abonnement</th>
                                <th>Notes</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {resultats.map((u) => {
                                const nbNotes = notes.filter((n) => n.userId === u.id).length;
                                const premium = u.abonnement === "premium";
                                return (
                                    <tr key={u.id}>
                                        <td>{`${u.prenom || ""} ${u.nom || ""}`.trim() || "—"}</td>
                                        <td>{u.email}</td>
                                        <td>
                                            <span className={`admin_statut ${premium ? "admin_statut_premium" : ""}`}>
                                                {premium ? "Premium" : "Gratuit"}
                                            </span>
                                        </td>
                                        <td>{nbNotes}</td>
                                        <td className="admin_tableau_action">
                                            <Link to={`/admin/utilisateurs/${u.id}`}>Voir le compte</Link>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}