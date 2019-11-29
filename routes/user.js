'use strict';

const {
  Router
} = require('express');
const router = new Router();
const User = require("./../models/user");
const Follow = require("./../models/follow");


router.get('/user/:username', (req, res, next) => {
  let userObj;
  User.findByUsername(req.params)
    .then((userObject) => {
      userObj = userObject;
      if (req.user) {
        return Follow.doYouFollow(req.user._id, userObject._id);
      } else {
        return false;
      }
    }).then(follow => {
      res.render('user', {
        userObj,
        follow
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
    profilePic: req.file.url   
  })    
  .then((user) => { 
    console.log(user)   
    res.redirect(`/user/${user.username}`)
  })
  .catch(error => console.log(error))
});

module.exports = router;