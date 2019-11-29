'use strict';

const mongoose = require('mongoose');
// const Follow = require("./../models/follow");

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
    default: '/images/logo_round.png'
  },
  name: {
    type: String,
    maxlength: 140,
    default: 'Wat2Watch User'
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
    type: String,
    maxlength: 140,
    default: 'Let us know what side of the force you\'re in!'
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
  const User = this;
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
  const User = this;
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
  const User = this;
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
  const User = this;
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
  const User = this;
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

userSchema.static('findFollowers', function (id) {
  const User = this;
  const Follow = mongoose.model('Follow');
  return Follow.find({
      users: id
    }, {
      user_id: 1
    })
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