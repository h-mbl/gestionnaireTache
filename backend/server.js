const express = require('express');
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

server.use("/", (req, res) => {
    res.send("Backend is running!");
});

const PORT = 1000;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}!`);
});
