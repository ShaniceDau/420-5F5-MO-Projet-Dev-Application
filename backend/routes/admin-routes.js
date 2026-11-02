import express from 'express';
import * as adminControllers from '../controllers/admin-controllers.js';

const router = express.Router();

router.post('/login', adminControllers.connectAdmin);
router.get('/users', adminControllers.getUsers);
router.get('/users/:email', adminControllers.getUser);
router.get('/abonnements', adminControllers.getAbonnements);
router.get('/abonnements/:id', adminControllers.getAbonnement);

export default router;