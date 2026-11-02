import mongoose from 'mongoose';

const partageSchema = new mongoose.Schema(
    {
        noteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Note', required: true },
        sharedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        sharedWith: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
    },
    { timestamps: true }
);

const Partage = mongoose.model('Partage', partageSchema);

export default Partage;