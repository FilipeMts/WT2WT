'use strict';

const mongoose = require('mongoose');

const mtvSchema = new mongoose.Schema({
    tmdb_id: {
        type: Number,
        required: true,
        unique: true,
        trim: true
    },
    imdb_id: {
        type: String,
        //required: true,
        unique: true,
        trim: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        enum: ['Movie', 'TV']
    },
    approveCount: {
        type: Number,
        default: 0
    },
    tmdbData: mongoose.Mixed
}, {
    timestamps: true
});

const Mtv = mongoose.model('Mtv', mtvSchema);

module.exports = Mtv;