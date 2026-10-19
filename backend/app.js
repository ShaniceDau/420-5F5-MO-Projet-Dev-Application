import express from 'express';
import cors from 'cors';
// Importer les routes des utilisateurs
import userRoutes from './routes/users-routes.js';
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

app.listen(PORT, () => {
    console.log(`serveur écoute au ${PORT}`);
});



