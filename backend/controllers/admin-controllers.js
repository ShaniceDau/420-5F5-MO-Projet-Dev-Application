import Admin from '../models/admin.js';
import User from '../models/users.js';
import Abonnement from '../models/abonnement.js';

const connectAdmin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        if (admin.password !== password) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        return res.status(200).json({
            message: 'Admin authenticated successfully',
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                permissions: admin.permissions
            }
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error authenticating admin', error });
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching users', error });
    }
};

const getUser = async (req, res) => {
    const { email } = req.params;

    try {
        const user = await User.findOne({ email }).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching user', error });
    }
};

const getAbonnements = async (req, res) => {
    try {
        const abonnements = await Abonnement.find().populate('userId', 'name email');
        return res.status(200).json(abonnements);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching abonnements', error });
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

export {
    connectAdmin,
    getUsers,
    getUser,
    getAbonnements,
    getAbonnement
};
