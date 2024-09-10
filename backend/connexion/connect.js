const { response } = require('express');
const mongoose = require('mongoose');
const connect = async () => {
    try {
        await mongoose.connect(`${process.env.MONGO_URI}`);
        if (response) {
            console.log("Connecté à MongoDB!");
        }

    } catch (erreur) {
        console.log(erreur);
    }
}

connect();
