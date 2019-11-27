'use strict';

const mongoose = require('mongoose');

const User = require("./../models/user");

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


followSchema.static('findFollowAndPush', function (id, idToFollow) {
    return Follow.findOne({
        user_id: id
    }).then((followObject) => {
        if (followObject.users.includes(idToFollow)) {
            console.log("You are already following this user.");
        } else {
            followObject.users.push(idToFollow);
            followObject.save();
            User.oneMoreFollow(id);
            User.oneMoreFollower(idToFollow);
        }
    }).catch((error) => {
        console.log(error)
    });
});

followSchema.static('findFollowAndDelete', function (id, idToUnfollow) {
    return Follow.findOne({
        user_id: id
    }).then((followObject) => {
        if (followObject.users.includes(idToUnfollow)) {
            followObject.users = followObject.users.filter(value => {
                value === idToUnfollow ? false : true
            });
            followObject.save();
            User.oneLessFollow(id);
            User.oneLessFollower(idToUnfollow);
        } else {
            console.log("You don't follow this user.");
        }
    }).catch((error) => {
        console.log(error)
    });
});

followSchema.static('doYouFollow', function (follower, followed) {
    return Follow.findOne({
        user_id: follower
    }).then((followObject) => {
        if (followObject.users.includes(followed)) {
            console.log("already following!")
            return Promise.resolve(true);
        } else {
            return Promise.resolve(false);
        }
    }).catch((error) => {
        console.log(error)
    });
});

const Follow = mongoose.model('Follow', followSchema);

module.exports = Follow;