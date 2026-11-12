import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { appelApi, MESSAGE_SERVEUR } from "../api";
import { activerPremium, chargerAbonnement, forfaitDe, revenirGratuit } from "../util/abonnements";
import "./AdminUsers.css";
import "./AdminAccount.css";

//consulter et modifier le compte d'un utilisateur (/admin/utilisateurs/:email)
export default function AdminCompte() {
    const { email } = useParams();

    const [utilisateur, setUtilisateur] = useState(null);
    const [abonnement, setAbonnement] = useState(null);
    const [chargement, setChargement] = useState(true);
    const [introuvable, setIntrouvable] = useState(false);
    const [erreurChargement, setErreurChargement] = useState("");

    const [message, setMessage] = useState("");
    const [erreur, setErreur] = useState("");

    //GET /api/admins/users/:email + son abonnement
    useEffect(() => {
        let annule = false;
        const charger = async () => {
            try {
                const user = await appelApi(`/admins/users/${encodeURIComponent(email)}`);
                const abo = await chargerAbonnement(user._id);
                if (annule) return;
                setUtilisateur(user);
                setAbonnement(abo);
            } catch (e) {
                if (annule) return;
                if (e.status === 404) setIntrouvable(true);
                else setErreurChargement(e.status ? "Impossible de charger ce compte." : MESSAGE_SERVEUR);
            } finally {
                if (!annule) setChargement(false);
            }
        };
        charger();
        return () => {
            annule = true;
        };
    }, [email]);

    if (chargement || erreurChargement) {
        return (
            <div className="admin_compte">
                <Link to="/admin" className="admin_retour">← Utilisateurs</Link>
                <p className={erreurChargement ? "admin_erreur" : "admin_aide"}>
                    {erreurChargement || "Chargement du compte..."}
                </p>
            </div>
        );
    }

    if (introuvable) {
        return (
            <div className="admin_compte">
                <Link to="/admin" className="admin_retour">← Utilisateurs</Link>
                <h2>Utilisateur introuvable</h2>
                <p>Ce compte n'existe pas ou a été supprimé.</p>
            </div>
        );
    }

    const forfait = forfaitDe(abonnement);
    const premium = forfait === "premium";

    //valider et enregistrer les modifications du compte
    const enregistrer = async (event) => {
        event.preventDefault();
        setMessage("");
        setErreur("");
        const formulaire = event.target;
        const data = Object.fromEntries(new FormData(formulaire).entries());

        if (!data.nom.trim()) {
            setErreur("Le nom est requis.");
            return;
        }
        //nouveau mot de passe : facultatif, mais les deux champs doivent etre pareils
        if ((data.motdepasse || data.confirmer) && data.motdepasse !== data.confirmer) {
            setErreur("Les deux mots de passe doivent être pareils.");
            return;
        }

        try {
            //nom (mot de passe si rempli) : PUT /api/users/:email
            const changements = { name: data.nom.trim() };
            if (data.motdepasse) changements.password = data.motdepasse;
            const misAJour = await appelApi(`/users/${encodeURIComponent(utilisateur.email)}`, {
                methode: "PUT",
                corps: changements,
            });
            setUtilisateur({ ...utilisateur, name: misAJour.name });

            //statut d'abonnement seulement s'il a change
            if (data.abonnement !== forfait) {
                const nouvelAbonnement =
                    data.abonnement === "premium"
                        ? await activerPremium(utilisateur._id)
                        : await revenirGratuit(abonnement);
                setAbonnement(nouvelAbonnement);
            }

            formulaire.motdepasse.value = "";
            formulaire.confirmer.value = "";
            setMessage("Le compte a été modifié.");
        } catch (e) {
            setErreur(e.status ? "La modification a échoué." : MESSAGE_SERVEUR);
        }
    };

    return (
        <div className="admin_compte">
            <Link to="/admin" className="admin_retour">Utilisateurs</Link>

            {/* en-tete : nom et statut */}
            <div className="admin_compte_entete">
                <div>
                    <h2>{utilisateur.name || utilisateur.email}</h2>
                    <p className="admin_compte_courriel">{utilisateur.email}</p>
                </div>
                <span className={`admin_statut ${premium ? "admin_statut_premium" : ""}`}>
                    {premium ? "Premium" : "Gratuit"}
                </span>
            </div>

            {/* consultation du compte */}
            <section className="admin_section">
                <h3>Informations du compte</h3>
                <dl className="admin_infos">
                    <div>
                        <dt>Identifiant</dt>
                        <dd>{utilisateur._id}</dd>
                    </div>
                    <div>
                        <dt>Nom</dt>
                        <dd>{utilisateur.name || "—"}</dd>
                    </div>
                    <div>
                        <dt>Courriel</dt>
                        <dd>{utilisateur.email}</dd>
                    </div>
                    <div>
                        <dt>Inscrit le</dt>
                        <dd>{new Date(utilisateur.createdAt).toLocaleDateString("fr-CA")}</dd>
                    </div>
                    <div>
                        <dt>Abonnement</dt>
                        <dd>{premium ? "Premium (notes illimitées)" : "Gratuit (10 notes maximum)"}</dd>
                    </div>
                    {premium && abonnement && (
                        <div>
                            <dt>Premium jusqu'au</dt>
                            <dd>{new Date(abonnement.endDate).toLocaleDateString("fr-CA")}</dd>
                        </div>
                    )}
                </dl>
            </section>

            {/* modification du compte */}
            <section className="admin_section">
                <h3>Modifier le compte</h3>
                <form
                    className="admin_form"
                    onSubmit={enregistrer}
                    onChange={() => {
                        setMessage("");
                        setErreur("");
                    }}
                    key={`${utilisateur._id}-${forfait}`}
                >
                    <div className="admin_control">
                        <label htmlFor="nom">Nom</label>
                        <input id="nom" name="nom" type="text" defaultValue={utilisateur.name} required />
                    </div>

                    <div className="admin_control">
                        <label htmlFor="courriel">Courriel</label>
                        <input id="courriel" type="email" value={utilisateur.email} disabled />
                        <span className="admin_aide">Le courriel ne peut pas être modifié pour l'instant.</span>
                    </div>

                    <div className="admin_control">
                        <label htmlFor="abonnement">Statut d'abonnement</label>
                        <select id="abonnement" name="abonnement" defaultValue={forfait}>
                            <option value="gratuit">Gratuit (10 notes maximum)</option>
                            <option value="premium">Premium (notes illimitées)</option>
                        </select>
                    </div>

                    <div className="admin_rangee">
                        <div className="admin_control">
                            <label htmlFor="motdepasse">Nouveau mot de passe</label>
                            <input id="motdepasse" name="motdepasse" type="password" autoComplete="new-password" />
                        </div>
                        <div className="admin_control">
                            <label htmlFor="confirmer">Confirmer le mot de passe</label>
                            <input id="confirmer" name="confirmer" type="password" autoComplete="new-password" />
                        </div>
                    </div>
                    <p className="admin_aide">Laissez les champs du mot de passe vides pour ne pas le changer.</p>

                    {erreur && <p className="admin_erreur">{erreur}</p>}
                    {message && <p className="admin_succes">{message}</p>}

                    <div className="admin_actions">
                        <Link to="/admin" className="admin_bouton_contour">Annuler</Link>
                        <button type="submit" className="admin_bouton">Enregistrer les modifications</button>
                    </div>
                </form>
            </section>
        </div>
    );
}