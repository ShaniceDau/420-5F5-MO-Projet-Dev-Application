import express from 'express';
import cors from 'cors';
import userRoutes from './routes/users-routes.js';
import noteRoutes from './routes/note-routes.js';
import partageRoutes from './routes/partage-routes.js';
import adminRoutes from './routes/admin-routes.js';
import abonnementRoutes from './routes/abonnement-routes.js';
import errorHandler from './handler/error-handler.js';
import { connectMongo } from './util/bd.js';

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tpsynthesedb';

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/users', userRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/partages', partageRoutes);
app.use('/api/abonnements', abonnementRoutes);
app.use('/api/admins', adminRoutes);

app.get('/', (req, res) => {
    res.send('Bienvenue sur l\'API de gestion des utilisateurs, notes et partages !');
});

app.use((req, res) => {
    res.status(404).json({ message: 'Route introuvable' });
});

app.use(errorHandler);

await connectMongo(MONGODB_URI);

app.listen(PORT, () => {
    console.log(`Serveur écoute sur le port ${PORT}`);
});



