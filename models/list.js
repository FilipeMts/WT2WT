'use strict';

const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['watched', 'watching', 'to watch', 'custom'],
        default: 'custom',
        required: true
    },
    mtvs: {
        type: [String],
        required: true
    }
}, {
    timestamps: true
});

const List = mongoose.model('List', listSchema);

module.exports = List;