import express from 'express';
import * as userControllers from '../controllers/users-controllers.js';

const router = express.Router();

router.get('/', userControllers.getUsers);
router.post('/register', userControllers.registerUser);
router.post('/login', userControllers.connectUser);
router.get('/:email', userControllers.getUser);
router.put('/:email', userControllers.updateUser);
router.delete('/:email', userControllers.deleteUser);

export default router;