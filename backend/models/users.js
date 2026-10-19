import mongoose from 'mongoose';
import validator from 'validator';

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: {
            type: String,
            required: true,
            unique: true,
            validate: [validator.isEmail, 'invalid email']
        },
        password: { type: String, required: true }
    },
    { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;