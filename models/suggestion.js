'use strict';

const mongoose = require('mongoose');

const suggestionSchema = new mongoose.Schema({
    toUser: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    mtvId: {
        type: mongoose.Types.ObjectId,
        ref: 'Mtv',
        required: true
    },
    fromUsers: {
        type: [userSchema],
        required: true
    },
    count: {
        type: Number,
        require: true,
        min: 0
    }
}, {
    timestamps: true
});

const Suggestion = mongoose.model('Suggestion', suggestionSchema);

module.exports = Suggestion;