const router = require('express').Router();
//const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const path = require('path');
const User = require(path.resolve(__dirname, '..', 'models', 'user'));
require('dotenv').config();

// INSCRIPTION
router.post('/sign-up', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "L'adresse email n'est pas valide !" });
        }

        const existingUser = await User.findOne({ username });
        const existingEmail = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "L'utilisateur existe déjà !" });
        } else if (username.length < 3) {
            return res.status(400).json({ message: "Le nom d'utilisateur est trop court !" });
        }

        if (existingEmail) {
            return res.status(400).json({ message: "L'adresse existe déjà !" });
        }

        const hashedPass = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email,
            password: hashedPass,
        });

        await newUser.save();
        return res.status(200).json({ message: "Connexion réussie !" });
    } catch (error) {
        console.log("Error signing in: ", error);
        return res.status(500).json({ message: "Internal server error!" });
    }
});

// CONNEXION
router.post('/log-in', async (req, res) => {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });

    if (!existingUser) {
        return res.status(400).json({ message: "Le nom d'utilisateur ou le mot de passe est incorrect !" });
    }

    bcrypt.compare(password, existingUser.password, (err, result) => {
        if (result) {
            const authClaims = [{ name: username }, { jti: jwt.sign({}, process.env.JWT_SECRET) }];
            const token = jwt.sign({ authClaims }, process.env.JWT_SECRET, { expiresIn: '2d' });
            return res.status(200).json({ message: "Connexion réussie !", id: existingUser._id, token });
        } else {
            return res.status(400).json({ message: "Le nom d'utilisateur ou le mot de passe est incorrect !" });
        }
    });
});

module.exports = router;
