'use strict';

const {
  Router
} = require('express');
const router = new Router();
const User = require("./../models/user");
const Follow = require("./../models/follow");
const Approve = require("./../models/approve");
const Suggestion = require("./../models/suggestion");


router.get('/user/:username', (req, res, next) => {
  let userObj;
  let followObj;
  let approvesObj;
  let suggestionsObj;
  User.findByUsername(req.params)
    .then((userObject) => {
      userObj = userObject;
      if (req.user) {
        return Follow.doYouFollow(req.user._id, userObject._id);
      } else {
        return false;
      }
    }).then(follow => {
      followObj = follow;
      return Approve.find({
        user_id: userObj._id
      }, {
        mtv_id: 1
      }).populate('mtv_id');
    }).then(approves => {
      approvesObj = approves;
      return Suggestion.find({
        toUser: userObj._id
      }, {
        mtv_id: 1
      }).populate('mtv_id');
    }).then(suggestions => {
      suggestionsObj = suggestions;
      res.render('user', {
        userObj,
        followObj,
        approvesObj,
        suggestionsObj
      });
    })
    .catch((error) => {
      console.log(error);
    });
});

router.get('/users/search', (req, res, next) => {
  User.findByUsername(req.query)
    .then((userObject) => {
      res.redirect(`/user/${userObject.username}`);
    })
    .catch((error) => {
      console.log(error);
    });
});

router.get('/users/', (req, res, next) => {
  User.find()
    .then((usersObject) => {
      res.render('user/all', {
        usersObject
      });
    })
    .catch((error) => {
      console.log(error);
    });
});

const routeGuard = require("../middleware/route-guard");

router.post('/user/:username/follow', routeGuard, (req, res, next) => {
  let followedUser;
  User.findByUsername(req.params)
    .then((userObject) => {
      followedUser = userObject;
      return Follow.findFollowAndPush(req.user._id, followedUser._id);
    }).then(followObject => {
      res.redirect(`/user/${followedUser.username}`);
    })
    .catch((error) => {
      console.log(error);
    });
});

router.post('/user/:username/unfollow', routeGuard, (req, res, next) => {
  let unfollowedUser;
  User.findByUsername(req.params)
    .then((userObject) => {
      unfollowedUser = userObject;
      return Follow.findFollowAndDelete(req.user._id, unfollowedUser._id);
    }).then(followObject => {
      res.redirect(`/user/${unfollowedUser.username}`);
    })
    .catch((error) => {
      console.log(error);
    });
});

router.get('/user/:username/edit', routeGuard, (req, res, next) => {
  res.render('./editProfile')
});

const multer = require('multer');
const cloudinary = require('cloudinary');
const storageCloudinary = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_API_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = storageCloudinary({
  cloudinary,
  folder: 'WAT',
  allowedFormats: ['jpg', 'png']
});

const uploader = multer({
  storage
});

router.post('/user/:username/edit', routeGuard, uploader.single('profilePic'), (req, res, next) => {
  console.log(req.body);
  //const {name, description, email, password, profilePic} = req.body
  User.findByIdAndUpdate(req.user._id, {
      name: req.body.name,
      description: req.body.description,
      email: req.body.email,
      passwordHash: req.body.password,
      profilePic: req.file ? req.file.url : '/images/logo_round.png'
    })
    .then((user) => {
      console.log(user)
      res.redirect(`/user/${user.username}`)
    })
    .catch(error => console.log(error))
});

module.exports = router;