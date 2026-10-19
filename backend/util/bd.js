import mongoose from 'mongoose';

let isConnected = false;

export const connectMongo = async () => {
    if (isConnected) return;
    let uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/';
    try {
        await mongoose.connect(uri);
        isConnected = true;
        console.log('Connexion MongoDB réussie');
    } catch (err) {
        console.error('Erreur de connexion MongoDB :', err.message);
        process.exit(1);
    }
};