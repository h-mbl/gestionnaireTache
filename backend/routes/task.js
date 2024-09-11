const router = require('express').Router();
const Task = require('../models/task');
const User = require('../models/user');
const { authToken } = require('../middleware/authController');

require('dotenv').config();

// Récupérer toutes les tâches publiques
router.get('/get-public-tasks', async (req, res) => {
    try {
        const publicTasks = await Task.find({ isPublic: true }).sort({ createdAt: -1 });
        res.status(200).json({ data: publicTasks });
    } catch (error) {
        console.log("Erreur lors de la récupération des tâches publiques : ", error);
        res.status(400).json({ message: "Erreur interne du serveur !" });
    }
});

// Récupérer toutes les tâches
router.get('/get-all-tasks', async (req, res) => {
    try {
        const { id } = req.headers;
        const userData = await User.findById(id).populate({
            path: 'tasks',
            options: { sort: { createdAt: -1 } }
        });
        return res.status(200).json({ data: userData });
    }
    catch (error) {
        console.log("Erreur lors de la récupération des tâches : ", error);
        return res.status(400).json({ message: "Erreur interne du serveur !" });
    }
});

// Récupérer toutes les tâches importantes
router.get('/get-imp-tasks', authToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const Data = await User.findById(id).populate({
            path: 'tasks',
            match: { important: true },
            options: { sort: { createdAt: -1 } }
        });
        const ImpTaskData = Data.tasks;
        return res.status(200).json({ data: ImpTaskData });
    }
    catch (error) {
        console.log("Erreur lors de la récupération des tâches : ", error);
        return res.status(400).json({ message: "Erreur interne du serveur !" });
    }
});

// Récupérer toutes les tâches complètes
router.get('/get-cmp-tasks', authToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const Data = await User.findById(id).populate({
            path: 'tasks',
            match: { complete: true },
            options: { sort: { createdAt: -1 } }
        });
        const cmpTaskData = Data.tasks;
        return res.status(200).json({ data: cmpTaskData });
    }
    catch (error) {
        console.log("Erreur lors de la récupération des tâches : ", error);
        return res.status(400).json({ message: "Erreur interne du serveur !" });
    }
});

// Récupérer toutes les tâches incomplètes
router.get('/get-incmp-tasks', authToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const Data = await User.findById(id).populate({
            path: 'tasks',
            match: { complete: false },
            options: { sort: { createdAt: -1 } }
        });
        const incmpTaskData = Data.tasks;
        return res.status(200).json({ data: incmpTaskData });
    }
    catch (error) {
        console.log("Erreur lors de la récupération des tâches : ", error);
        return res.status(400).json({ message: "Erreur interne du serveur !" });
    }
});

// Recherche de tâche privée
router.get('/search-tasks', async (req, res) => {
    try {
        const { id } = req.headers;
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({ message: "La requête de recherche est requise" });
        }

        const userData = await User.findById(id).populate({
            path: 'tasks',
            match: {
                $or: [
                    { title: { $regex: query, $options: 'i' } },
                    { description: { $regex: query, $options: 'i' } }
                ]
            },
            options: { sort: { createdAt: -1 } }
        });

        return res.status(200).json({ data: userData.tasks });
    } catch (error) {
        console.log("Erreur lors de la recherche des tâches privées : ", error);
        return res.status(400).json({ message: "Erreur interne du serveur !" });
    }
});

// Recherche de tâche publique
router.get('/search-public-tasks', async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({ message: "La requête de recherche est requise" });
        }

        const publicTasks = await Task.find({
            isPublic: true,
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ]
        }).sort({ createdAt: -1 });

        return res.status(200).json({ data: publicTasks });
    } catch (error) {
        console.log("Erreur lors de la recherche des tâches publiques : ", error);
        return res.status(400).json({ message: "Erreur interne du serveur !" });
    }
});

// Création de tâche
router.post('/create-task', authToken, async (req, res) => {
    try {
        const { title, description, isPublic } = req.body;
        const { id } = req.headers;
        const newTask = new Task({ title: title, description: description, isPublic: isPublic || false });
        const saveTask = await newTask.save();
        const taskID = saveTask._id;
        await User.findByIdAndUpdate(id, { $push: { tasks: taskID._id } });
        res.status(200).json({ message: "Tâche créée avec succès !" });
    } catch (error) {
        console.log("Erreur lors de la création de la tâche : ", error);
        res.status(400).json({ message: "Erreur interne du serveur !" });
    }
});

// Supprimer une tâche
router.delete('/delete-task/:id', authToken, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.headers.id;
        await Task.findByIdAndDelete(id);
        await User.findByIdAndUpdate(userId, { $pull: { tasks: id } });
        return res.status(200).json({ message: "Tâche supprimée avec succès !" });
    }
    catch (error) {
        console.log("Erreur lors de la suppression de la tâche : ", error);
        return res.status(400).json({ message: "Erreur interne du serveur !" });
    }
});

// Mettre à jour une tâche
router.put('/update-task/:id', authToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;
        await Task.findByIdAndUpdate(id, { title: title, description: description });
        res.status(200).json({ message: "Tâche mise à jour avec succès !" });
    }
    catch (error) {
        console.log("Erreur lors de la mise à jour de la tâche : ", error);
        return res.status(400).json({ message: "Erreur interne du serveur !" });
    }
});

// Mettre à jour une tâche importante
router.put('/update-imp-task/:id', authToken, async (req, res) => {
    try {
        const { id } = req.params;
        const TaskData = await Task.findById(id);
        const ImpTask = TaskData.important;
        await Task.findByIdAndUpdate(id, { important: !ImpTask });
        res.status(200).json({ message: "Tâche mise à jour avec succès !" });
    }
    catch (error) {
        console.log("Erreur lors de la mise à jour de la tâche : ", error);
        return res.status(400).json({ message: "Erreur interne du serveur !" });
    }
});

// Mettre à jour une tâche complète
router.put('/update-cmp-task/:id', authToken, async (req, res) => {
    try {
        const { id } = req.params;
        const TaskData = await Task.findById(id);
        const CmpTask = TaskData.complete;
        await Task.findByIdAndUpdate(id, { complete: !CmpTask });
        res.status(200).json({ message: "Tâche mise à jour avec succès !" });
    }
    catch (error) {
        console.log("Erreur lors de la mise à jour de la tâche : ", error);
        return res.status(400).json({ message: "Erreur interne du serveur !" });
    }
});

// Mettre à jour une tâche publique
router.put('/update-public-task/:id', authToken, async (req, res) => {
    try {
        const { id } = req.params;
        const TaskData = await Task.findById(id);
        const PublicTask = TaskData.isPublic;
        await Task.findByIdAndUpdate(id, { isPublic: !PublicTask });
        res.status(200).json({ message: "Tâche mise à jour avec succès !" });
    }
    catch (error) {
        console.log("Erreur lors de la mise à jour de la tâche : ", error);
        return res.status(400).json({ message: "Erreur interne du serveur !" });
    }
});

module.exports = router;
