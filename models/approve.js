'use strict';

const mongoose = require('mongoose');

const approveSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    mtvId: {
        type: mongoose.Types.ObjectId,
        ref: 'Mtv',
        required: true
    }
}, {
    timestamps: true
});

const Approve = mongoose.model('Approve', approveSchema);

module.exports = Approve;