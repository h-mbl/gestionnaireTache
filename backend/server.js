const express = require('express');
const path = require('path');
const server = express();
require('dotenv').config({ path: path.resolve(__dirname, '.env') }); // Utilisation de .env dans backend
require(path.resolve(__dirname, 'connexion', 'connect')); // Chemin absolu vers connect.js
const cors = require('cors');
const UserAPI = require(path.resolve(__dirname, 'routes', 'user')); // Chemin absolu vers user.js dans routes
const TaskAPI = require(path.resolve(__dirname, 'routes', 'task')); // Chemin absolu vers task.js dans routes

server.use(express.json());
server.use(cors());

server.use("/api/user", UserAPI);
server.use("/api/tache", TaskAPI);

// Servir les fichiers statiques du frontend
server.use(express.static(path.resolve(__dirname, '../frontend/build')));

// Toutes les routes non-API seront redirigées vers l'index.html du frontend
server.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/build', 'index.html'));
});

const PORT = process.env.PORT || 1000;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}!`);
});
