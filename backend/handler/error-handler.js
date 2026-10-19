function errorHandler(error, req, res, next) {
    if (res.headersSent) {
        return next(error);
    }
    res.status(error.code || 500);

    res.json({ message: error.message || "Un problème inattendu s'est produit !" });
}
export default errorHandler;
