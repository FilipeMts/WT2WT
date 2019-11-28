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

module.exports = router;