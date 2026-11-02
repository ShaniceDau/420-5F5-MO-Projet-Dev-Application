//admin qui gere utilisateur + abonnement
import mongoose from 'mongoose';
import validator from 'validator';

const adminSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: {
            type: String,
            required: true,
            unique: true,
            validate: [validator.isEmail, 'invalid email']
        },
        password: { type: String, required: true },
        permissions: { type: [String], default: [] } // Permissions admin
    },
    { timestamps: true }
);

const Admin = mongoose.model('Admin', adminSchema);

export default Admin;