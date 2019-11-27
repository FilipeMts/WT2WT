'use strict';

const mongoose = require('mongoose');
const Mtv = require("./../models/mtv");

const approveSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    mtv_id: {
        type: mongoose.Types.ObjectId,
        ref: 'Mtv',
        required: true
    }
}, {
    timestamps: true
});

approveSchema.static('findOrCreate', function (mtv, user) {
    return Approve.findOne({
            $and: [{
                mtv_id: mtv
            }, {
                user_id: user
            }]
        })
        .then(approve => {
            if (!approve) {
                // If no mtv was found, return a rejection with an error to the error handler at the end
                return Approve.create({
                        user_id: user,
                        mtv_id: mtv
                    })
                    .then(approveObject => {
                        Mtv.oneMoreApprove(approveObject.mtv_id);
                        return approveObject;
                    })
                    .catch(error => {
                        console.log(error);
                    });
            } else {
                return approve;
            }
        })
        .catch(error => {
            console.log(error);
        });
});


const Approve = mongoose.model('Approve', approveSchema);

module.exports = Approve;