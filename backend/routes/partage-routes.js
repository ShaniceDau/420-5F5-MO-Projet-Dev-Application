import express from 'express';
import * as partageControllers from '../controllers/partage-controllers.js';

const router = express.Router();

router.get('/', partageControllers.getPartages);
router.post('/', partageControllers.createPartage);
router.get('/:id', partageControllers.getPartage);
router.put('/:id', partageControllers.updatePartage);
router.delete('/:id', partageControllers.deletePartage);

export default router;
