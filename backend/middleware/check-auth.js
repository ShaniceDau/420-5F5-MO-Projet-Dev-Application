import jwt from 'jsonwebtoken';
import HttpError from '../util/http-error.js';
const checkAuth = (req, res, next) => {
    try {
        if (req.method === 'OPTIONS') {
            return next();
        }
        const token = req.headers.authorization.split(" ")[1]; // 'Bearer TOKEN'
        if (!token) {
            throw new Error("Authentification échouée...");
        }
        const decodedToken = jwt.verify(token, "chUt2!");
        req.userData = { userId: decodedToken.userId, role: decodedToken.role };
        next();
    } catch (err) {
        const error = new HttpError('Authentication failed!', 401);
        return next(error);
    }
};

export default checkAuth;
