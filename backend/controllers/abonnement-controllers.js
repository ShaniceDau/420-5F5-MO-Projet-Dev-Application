import Abonnement from '../models/abonnement.js';

const getAbonnements = async (req, res) => {
    try {
        const abonnements = await Abonnement.find().populate('userId', 'name email');
        res.status(200).json(abonnements);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching abonnements', error });
    }
};

const createAbonnement = async (req, res) => {
    const { userId, type, startDate, endDate } = req.body;

    if (!userId || !type || !endDate) {
        return res.status(400).json({ message: 'userId, type and endDate are required' });
    }

    try {
        const abonnement = new Abonnement({
            userId,
            type,
            startDate: startDate || new Date(),
            endDate
        });

        await abonnement.save();
        return res.status(201).json(abonnement);
    } catch (error) {
        return res.status(500).json({ message: 'Error creating abonnement', error });
    }
};

const getAbonnement = async (req, res) => {
    const { id } = req.params;

    try {
        const abonnement = await Abonnement.findById(id).populate('userId', 'name email');
        if (!abonnement) {
            return res.status(404).json({ message: 'Abonnement not found' });
        }

        return res.status(200).json(abonnement);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching abonnement', error });
    }
};

const updateAbonnement = async (req, res) => {
    const { id } = req.params;
    const { userId, type, startDate, endDate } = req.body;

    try {
        const abonnement = await Abonnement.findByIdAndUpdate(
            id,
            { userId, type, startDate, endDate },
            { new: true }
        );

        if (!abonnement) {
            return res.status(404).json({ message: 'Abonnement not found' });
        }

        return res.status(200).json(abonnement);
    } catch (error) {
        return res.status(500).json({ message: 'Error updating abonnement', error });
    }
};

const deleteAbonnement = async (req, res) => {
    const { id } = req.params;

    try {
        const abonnement = await Abonnement.findByIdAndDelete(id);
        if (!abonnement) {
            return res.status(404).json({ message: 'Abonnement not found' });
        }

        return res.status(200).json({ message: 'Abonnement deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Error deleting abonnement', error });
    }
};

export {
    getAbonnements,
    createAbonnement,
    getAbonnement,
    updateAbonnement,
    deleteAbonnement
};