import express from 'express';
import * as noteControllers from '../controllers/notes-controllers.js';

const router = express.Router();

router.get('/', noteControllers.getNotes);
router.post('/', noteControllers.createNote);
router.get('/:id', noteControllers.getNote);
router.put('/:id', noteControllers.updateNote);
router.delete('/:id', noteControllers.deleteNote);

export default router;
