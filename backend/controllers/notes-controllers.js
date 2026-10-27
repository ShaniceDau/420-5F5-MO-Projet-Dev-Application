import Note from '../models/note.js';

const getNotes = async (req, res) => {
    try {
        const notes = await Note.find();
        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching notes', error });
    }
};

const createNote = async (req, res) => {
    const { title, content } = req.body;
    try {
        const note = new Note({ title, content });
        await note.save();
        res.status(201).json(note);
    } catch (error) {
        res.status(500).json({ message: 'Error creating note', error });
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
