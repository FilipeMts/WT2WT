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
        type: [mongoose.Types.ObjectId],
        ref: 'Mtv',
        required: true
    }
}, {
    timestamps: true
});

listSchema.method('findMtvOrPush', function (mtv_id) {
    if (this.mtvs.includes(mtv_id)) {
        console.log("Mtv is already on the list");
    } else {
        this.mtvs.push(mtv_id);
        this.save();
    }
});

const List = mongoose.model('List', listSchema);

module.exports = List;