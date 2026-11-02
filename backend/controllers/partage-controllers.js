import Partage from '../models/partage.js';

const getPartages = async (req, res) => {
    try {
        const partages = await Partage.find()
            .populate('noteId')
            .populate('sharedBy', 'name email')
            .populate('sharedWith', 'name email');

        return res.status(200).json(partages);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching partages', error });
    }
};

const createPartage = async (req, res) => {
    const { noteId, sharedBy, sharedWith } = req.body;

    if (!noteId || !sharedBy || !sharedWith) {
        return res.status(400).json({ message: 'noteId, sharedBy and sharedWith are required' });
    }

    try {
        const partage = new Partage({ noteId, sharedBy, sharedWith });
        await partage.save();
        return res.status(201).json(partage);
    } catch (error) {
        return res.status(500).json({ message: 'Error creating partage', error });
    }
};

const getPartage = async (req, res) => {
    const { id } = req.params;

    try {
        const partage = await Partage.findById(id)
            .populate('noteId')
            .populate('sharedBy', 'name email')
            .populate('sharedWith', 'name email');

        if (!partage) {
            return res.status(404).json({ message: 'Partage not found' });
        }

        return res.status(200).json(partage);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching partage', error });
    }
};

const updatePartage = async (req, res) => {
    const { id } = req.params;
    const { noteId, sharedBy, sharedWith } = req.body;

    try {
        const partage = await Partage.findByIdAndUpdate(
            id,
            { noteId, sharedBy, sharedWith },
            { new: true }
        );

        if (!partage) {
            return res.status(404).json({ message: 'Partage not found' });
        }

        return res.status(200).json(partage);
    } catch (error) {
        return res.status(500).json({ message: 'Error updating partage', error });
    }
};

const deletePartage = async (req, res) => {
    const { id } = req.params;

    try {
        const partage = await Partage.findByIdAndDelete(id);
        if (!partage) {
            return res.status(404).json({ message: 'Partage not found' });
        }

        return res.status(200).json({ message: 'Partage deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Error deleting partage', error });
    }
};

export { getPartages, createPartage, getPartage, updatePartage, deletePartage };
