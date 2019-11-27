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
    type: Number,
    default: 0,
    min: 0
  },
  followersCount: {
    type: Number,
    default: 0,
    min: 0
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


userSchema.static('oneMoreFollower', function (id) {
  return User.findById(id)
    .then(user => {
      if (!user) {
        return Promise.reject("There's no user with that id");
      } else {
        user.followersCount++;
        return user.save();
      }
    })
    .catch(error => {
      console.log(error);
    });
});

userSchema.static('oneMoreFollow', function (id) {
  return User.findById(id)
    .then(user => {
      if (!user) {
        return Promise.reject("There's no user with that id");
      } else {
        user.followingCount++;
        return user.save();
      }
    })
    .catch(error => {
      console.log(error);
    });
});

userSchema.static('oneLessFollower', function (id) {
  return User.findById(id)
    .then(user => {
      if (!user) {
        return Promise.reject("There's no user with that id");
      } else {
        user.followersCount--;
        return user.save();
      }
    })
    .catch(error => {
      console.log(error);
    });
});

userSchema.static('oneLessFollow', function (id) {
  return User.findById(id)
    .then(user => {
      if (!user) {
        return Promise.reject("There's no user with that id");
      } else {
        user.followingCount--;
        return user.save();
      }
    })
    .catch(error => {
      console.log(error);
    });
});

userSchema.static('findByUsername', function (username) {
  return User.findOne(username)
    .then(user => {
      if (!user) {
        return Promise.reject("There's no user with that username");
      } else {
        return user;
      }
    })
    .catch(error => {
      console.log(error);
    });
});

const User = mongoose.model('User', userSchema);

module.exports = User;