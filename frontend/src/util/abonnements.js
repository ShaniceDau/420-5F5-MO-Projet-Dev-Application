import { appelApi } from "../api";

//dans le backend, un utilisateur peut avoir plusieurs abonnements 
export function dernierAbonnement(abonnements, userId) {
    const siens = abonnements.filter((a) => a.userId && (a.userId._id || a.userId) === userId);
    siens.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return siens[0] || null;
}

//premium ou gratuit
export function forfaitDe(abonnement) {
    return abonnement && abonnement.type === "premium" ? "premium" : "gratuit";
}

//va chercher l'abonnement actuel d'un utilisateur dans le backend
export async function chargerAbonnement(userId) {
    const abonnements = await appelApi("/abonnements");
    return dernierAbonnement(abonnements, userId);
}

//passer un utilisateur au forfait premium pour 1 mois
export async function activerPremium(userId) {
    const fin = new Date();
    fin.setMonth(fin.getMonth() + 1);
    return appelApi("/abonnements", {
        methode: "POST",
        corps: { userId, type: "premium", endDate: fin },
    });
}

//repasser un utilisateur au forfait gratuit 
export async function revenirGratuit(abonnementActuel) {
    if (!abonnementActuel) return null;
    return appelApi(`/abonnements/${abonnementActuel._id}`, {
        methode: "PUT",
        corps: {
            userId: abonnementActuel.userId._id || abonnementActuel.userId,
            type: "gratuit",
            startDate: abonnementActuel.startDate,
            endDate: new Date(),
        },
    });
}