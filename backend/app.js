import express from 'express';
import cors from 'cors';
// Importer les routes des utilisateurs
import userRoutes from './routes/users-routes.js';
import noteRoutes from './routes/note-routes.js';
import partageRoutes from './routes/partage-routes.js';
import adminRoutes from './routes/admin-routes.js';
import abonnementRoutes from './routes/abonnement-routes.js';
import { connectMongo } from './util/bd.js';

const PORT = process.env.PORT || 3000;


const MONGODB_URI =
    process.env.MONGODB_URI || "mongodb://localhost:27017/tpsynthesedb";
//Se connecter à MongoDB
await connectMongo();

const app = express();

app.use(express.json());

app.use(cors());
// Utiliser les routes des utilisateurs
app.use('/api/users', userRoutes);
// Utiliser les routes des notes
app.use('/api/notes', noteRoutes);
// Utiliser les routes des partages
app.use('/api/partages', partageRoutes);
// Utiliser les routes des abonnements
app.use('/api/abonnements', abonnementRoutes);
//Utiliser les routes des administrateurs
app.use('/api/admins', adminRoutes);

// Définir une route de base pour vérifier que le serveur fonctionne
app.get('/', (req, res) => {
    res.send('Bienvenue sur l\'API de gestion des utilisateurs, notes et partages !');
});

app.listen(PORT, () => {
    console.log(`serveur écoute au ${PORT}`);
});



