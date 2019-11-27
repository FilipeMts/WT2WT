'use strict';

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  googleId: {
    type: String
  },
  googleToken: {
    type: String,
    trim: true,
  },
  profilePic: {
    type: String,
    default: 'https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fwww.owensvalleyhistory.com%2Fat_the_movies22%2Fthemovies01.png&f=1&nofb=1'
  },
  passwordHash: {
    type: String,
    //required: true
  },
  status: {
    type: String,
    enum: ['Pending Confirmation', 'Active'],
    default: 'Pending Confirmation'
  },
  confirmationCode: {
    type: String,
    unique: true
  },
  description: {
    type: String
  },
  followingCount: {
    type: Number
  },
  followersCount: {
    type: Number
  },
  watchingList: {
    type: mongoose.Types.ObjectId,
    ref: 'List'
  },
  watchedList: {
    type: mongoose.Types.ObjectId,
    ref: 'List'
  },
  towatchList: {
    type: mongoose.Types.ObjectId,
    ref: 'List'
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);

userSchema.methods.addToFollowerCount = function (cb) {
  this.followersCount++;
  this.save();
};

userSchema.methods.addToFollowingCount = function (cb) {
  this.followingCount++;
  this.save();
};

module.exports = User;