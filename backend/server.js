const express = require('express');
const path = require('path');
const cors = require('cors');
const server = express();

// Charger les variables d'environnement
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Connexion à la base de données
require(path.join(__dirname, 'connexion', 'connect'));

// Importer les routes
const UserAPI = require(path.join(__dirname, 'routes', 'user'));
const TaskAPI = require(path.join(__dirname, 'routes', 'task'));

// Middleware
server.use(express.json());
server.use(cors());

// Routes API
server.use("/api/user", UserAPI);
server.use("/api/tache", TaskAPI);

// Route de base pour vérifier que le serveur fonctionne
server.use("/", (req, res) => {
    res.send("Backend is running!");
});

// Gestion des erreurs
server.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Configuration du port
const PORT = process.env.PORT || 1000;

// Démarrage du serveur
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}!`);
});