import Note from '../models/note.js';
import Abonnement from '../models/abonnement.js';
import { canCreateNote } from '../util/abonnement-limit.js';

const resolveUserPlan = async (userId) => {
    const abonnement = await Abonnement.findOne({ userId }).sort({ createdAt: -1 }).exec();

    if (!abonnement) {
        return 'gratuit';
    }

    const normalizedPlan = String(abonnement.type ?? 'gratuit').trim().toLowerCase();
    return normalizedPlan === 'premium' ? 'premium' : 'gratuit';
};

const getNotes = async (req, res) => {
    try {
        const notes = await Note.find();
        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching notes', error });
    }
};

const createNote = async (req, res) => {
    const { title, content, userId } = req.body;

    if (!title || !content || !userId) {
        return res.status(400).json({
            message: 'title, content and userId are required'
        });
    }

    try {
        const currentNotesCount = await Note.countDocuments({ userId });
        const plan = await resolveUserPlan(userId);

        if (!canCreateNote(plan, currentNotesCount)) {
            return res.status(403).json({
                message: 'Le forfait gratuit permet jusqu\'à 10 notes. Passez au plan premium pour débloquer un nombre illimité de notes.'
            });
        }

        const note = new Note({ userId, title, content });
        await note.save();
        return res.status(201).json(note);
    } catch (error) {
        return res.status(500).json({ message: 'Error creating note', error });
    }
};
const getNote = async (req, res) => {
    const { id } = req.params;
    try {
        const note = await Note.findById(id);
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }
        res.status(200).json(note);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching note', error });
    }
};

const updateNote = async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    try {
        const note = await Note.findByIdAndUpdate(
            id,
            { title, content },
            { new: true }
        );
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }
        res.status(200).json(note);
    } catch (error) {
        res.status(500).json({ message: 'Error updating note', error });
    }
};

const deleteNote = async (req, res) => {
    const { id } = req.params;
    try {
        const note = await Note.findByIdAndDelete(id);
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }
        res.status(200).json({ message: 'Note deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting note', error });
    }
};


export { getNotes, createNote, getNote, updateNote, deleteNote };
