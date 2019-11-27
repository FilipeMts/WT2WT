'use strict';

const mongoose = require('mongoose');

const suggestionSchema = new mongoose.Schema({
    toUser: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    mtv_id: {
        type: mongoose.Types.ObjectId,
        ref: 'Mtv',
        required: true
    },
    fromUsers: {
        type: [mongoose.Types.ObjectId],
        ref: 'User',
        required: true
    },
    count: {
        type: Number,
        require: true,
        default: 1,
        min: 0
    }
}, {
    timestamps: true
});

suggestionSchema.static('findOrCreate', function (mtv, user, approver) {
    return Suggestion.findOne({
            $and: [{
                mtv_id: mtv
            }, {
                toUser: user
            }]
        })
        .then(suggestion => {
            if (!suggestion) {
                // If no mtv was found, return a rejection with an error to the error handler at the end
                return Suggestion.create({
                        toUser: user,
                        mtv_id: mtv
                    })
                    .then(suggestionObject => {
                        if (!suggestionObject.fromUsers.includes(approver)) {
                            suggestionObject.fromUsers.push(approver);
                            suggestionObject.save();
                        }
                        return suggestionObject;
                    })
                    .catch(error => {
                        console.log(error);
                    });
            } else {
                // If there's one, resolve promise with the value
                if (!suggestion.fromUsers.includes(approver)) {
                    suggestion.fromUsers.push(approver);
                    suggestion.save();
                }
                return suggestion;
            }
        })
        .catch(error => {
            console.log(error);
        });
});

const Suggestion = mongoose.model('Suggestion', suggestionSchema);

module.exports = Suggestion;