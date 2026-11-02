import mongoose from 'mongoose';

const abonnementSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        type: {
            type: String,
            enum: ['gratuit', 'premium'],
            required: true,
            default: 'gratuit'
        },
        startDate: { type: Date, required: true, default: Date.now },
        endDate: { type: Date, required: true }
    },
    { timestamps: true }
);

const Abonnement = mongoose.model('Abonnement', abonnementSchema);

export default Abonnement;  