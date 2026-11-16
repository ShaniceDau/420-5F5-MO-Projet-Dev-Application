# 420-5F5-MO-Projet-Dev-Application
** Application de prises de notes
**Frontend** : React 19 + Vite, React Router
**Backend** : Node.js + Express + Mongoose
**Base de données** : MongoDB (Atlas)

## Prérequis
Clone le depot de github

## Installation
npm install (installation des dependances)

## Créer le fichier `.env` du backend (après la connexion du frontend au backend)
Le fichier `.env` n'est pas dans le dépôt, parce qu'il contient le mot de passe de la base de données.
Créez un fichier nommé **`.env`** dans le dossier **`backend`**.

L'adresse doit être transmise séparément par notre équipe

## Utilisation

Il faut **deux terminaux** ouverts en même temps.

**Terminal 1 - backend**
```bash
cd backend
npm run dev
```
Résultat attendu :
```
Connexion MongoDB réussie
Serveur écoute sur le port 3000
```

**Terminal 2 - frontend**
```bash
cd frontend
npm run dev
```
Puis ouvrez **http://localhost:5173** dans le navigateur.

### Comptes

| Rôle | Adresse | Identifiants |
|---|---|---|
| Utilisateur | http://localhost:5173/login | Créer un compte avec **Inscrivez-vous** |
| Administrateur | http://localhost:5173/admin/login | `admin@nota.com` / `admin123` |

# Droits
Tout droits reserves

# Contribution / Contact
Peut clone, fork, telecharge, modifie, distribue, partage

# Equipe de developpement
- **Shanice** - frontend, connexion frontend et backend
- **Huriel** - backend (API, modèles, base de données)