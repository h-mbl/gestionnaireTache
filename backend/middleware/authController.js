const jwt = require('jsonwebtoken');

require('dotenv').config();

const authToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Accès non autorisé ! TOKEN REQUIS" });
    }

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        req.user = user;
        next();
    } catch (err) {
        return res.status(403).json({ message: "Accès non autorisé ! TOKEN EST INVALIDE" });
    }
};

module.exports = { authToken };
