'use strict';

const mongoose = require('mongoose');

const followSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    users: {
        type: [mongoose.Types.ObjectId],
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

const Follow = mongoose.model('Follow', followSchema);

module.exports = Follow;