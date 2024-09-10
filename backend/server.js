const express = require('express');
const path = require('path'); // Ajoutez cette ligne
const server = express();
require('dotenv').config();
require('./connexion/connect');
const cors = require('cors');
const UserAPI = require('./routes/user');
const TaskAPI = require('./routes/task');

server.use(express.json());
server.use(cors());

server.use("/api/user", UserAPI);
server.use("/api/tache", TaskAPI);

// Servir les fichiers statiques du frontend
server.use(express.static(path.join(__dirname, '../frontend/build')));

// Toutes les routes non-API seront redirigées vers l'index.html du frontend
server.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

// Supprimez ou commentez cette route car elle interfère avec le frontend
// server.use("/", (req, res) => {
//     res.send("Backend is running!");
// });

const PORT = process.env.PORT || 1000;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}!`);
});