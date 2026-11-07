//adresse du backend : a changer a un seul endroit si le port ou le serveur change
export const API_URL = "http://localhost:3000/api";

//envoie une requete au backend et renvoie sa reponse en JSON
export async function appelApi(chemin, { methode = "GET", corps } = {}) {
    const reponse = await fetch(API_URL + chemin, {
        method: methode,
        headers: corps ? { "Content-Type": "application/json" } : undefined,
        body: corps ? JSON.stringify(corps) : undefined,
    });

    const donnees = await reponse.json().catch(() => null);

    if (!reponse.ok) {
        const erreur = new Error((donnees && donnees.message) || "Erreur du serveur");
        erreur.status = reponse.status;
        throw erreur;
    }

    return donnees;
}

//message a afficher quand le backend ne repond pas
export const MESSAGE_SERVEUR = "Impossible de joindre le serveur. Vérifiez que le backend est lancé.";