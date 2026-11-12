import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { appelApi, MESSAGE_SERVEUR } from "../api";
import { dernierAbonnement, forfaitDe } from "../util/abonnements";
import "./AdminUsers.css";

//liste des utilisateurs et recherche par nom ou courriel
export default function AdminUsers() {
    const [recherche, setRecherche] = useState("");
    const [utilisateurs, setUtilisateurs] = useState([]);
    const [chargement, setChargement] = useState(true);
    const [erreur, setErreur] = useState("");

    //GET /api/admins/users (sans les mots de passe) et GET /api/admins/abonnements
    useEffect(() => {
        let annule = false;
        const charger = async () => {
            try {
                const users = await appelApi("/admins/users");
                const abonnements = await appelApi("/admins/abonnements");
                if (annule) return;
                setUtilisateurs(
                    users.map((u) => ({
                        id: u._id,
                        nom: u.name,
                        email: u.email,
                        forfait: forfaitDe(dernierAbonnement(abonnements, u._id)),
                    }))
                );
            } catch (e) {
                if (!annule) setErreur(e.status ? "Impossible de charger les utilisateurs." : MESSAGE_SERVEUR);
            } finally {
                if (!annule) setChargement(false);
            }
        };
        charger();
        return () => {
            annule = true;
        };
    }, []);

    //garder les utilisateurs dont le nom ou le courriel contient le texte recherche
    const texte = recherche.trim().toLowerCase();
    const resultats = utilisateurs.filter((u) => `${u.nom} ${u.email}`.toLowerCase().includes(texte));

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

            {chargement || erreur ? (
                <p className="admin_aucun">{erreur || "Chargement des utilisateurs..."}</p>
            ) : (
                <>
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
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {resultats.map((u) => {
                                        const premium = u.forfait === "premium";
                                        return (
                                            <tr key={u.id}>
                                                <td>{u.nom || "—"}</td>
                                                <td>{u.email}</td>
                                                <td>
                                                    <span className={`admin_statut ${premium ? "admin_statut_premium" : ""}`}>
                                                        {premium ? "Premium" : "Gratuit"}
                                                    </span>
                                                </td>
                                                <td className="admin_tableau_action">
                                                    <Link to={`/admin/utilisateurs/${encodeURIComponent(u.email)}`}>
                                                        Voir le compte
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}