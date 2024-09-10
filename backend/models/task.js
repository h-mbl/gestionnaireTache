const mongoose = require('mongoose');
const taskSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true,
        unique: true
    },

    important: {
        type: Boolean,
        default: false
    },

    complete: {
        type: Boolean,
        default: false
    }, 

    isPublic: {
        type: Boolean,
        default: false
    },

    date: {
        type: Date,
        default: Date.now
    },
},
{
    timestamps: true 
},
    
);



module.exports = mongoose.model('task', taskSchema);