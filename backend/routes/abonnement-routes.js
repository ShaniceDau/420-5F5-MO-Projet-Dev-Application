// routes abonnement
import express from 'express';
import * as abonnementControllers from '../controllers/abonnement-controllers.js';

const router = express.Router();

router.get('/', abonnementControllers.getAbonnements);
router.post('/', abonnementControllers.createAbonnement);
router.get('/:id', abonnementControllers.getAbonnement);
router.put('/:id', abonnementControllers.updateAbonnement);
router.delete('/:id', abonnementControllers.deleteAbonnement);

export default router;