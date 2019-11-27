'use strict'

const {
  Router
} = require("express");
const router = new Router();

const User = require("./../models/user");
const bcryptjs = require("bcryptjs");

router.get("/success", (req, res, next) => {
  res.render("success");
  //console.log(req.user);
});

router.get("/confirm/:token", (req, res, next) => {
  const token = req.params.token;
  User.findOneAndUpdate({
      confirmationCode: token
    }, {
      status: "Active"
    })
    .then(user => {
      //console.log(user)
      req.session.user = user._id;
      res.redirect("/success");
    })
    .catch(err => {
      next(err)
    });
});


//SET PASSPORT
const passport = require('passport');

router.get('/sign-in', (req, res, next) => {
  res.render('./auth/sign-in');
});

router.post(
  '/sign-in',
  passport.authenticate('sign-in', {
    successRedirect: `/profile`,
    failureRedirect: './auth/sign-in'
  })
);

router.get('/sign-up', (req, res, next) => {
  res.render('./auth/sign-up');
});

router.post(
  '/sign-up',
  passport.authenticate('sign-up', {
    successRedirect: '/profile',
    failureRedirect: './auth/sign-up'
  })
);

//GOOGLE SIGNUP/IN
router.get('/auth/google',
  passport.authenticate('google', {
    scope: ['profile', "email"]
  }));

router.get('/auth/google/redirect',
  passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: './auth/sign-up'
  })
);


//FACEBOOK SIGNUP/IN
router.get('/login/facebook',
  passport.authenticate('facebook'));

router.get('/auth/facebook/redirect',
  passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: './auth/sign-up'
  })
);

// SIGNOUT
router.post("/sign-out", (req, res, next) => {
  req.session.destroy();
  res.redirect("/");
});

const routeGuard = require("../middleware/route-guard");

router.get("/profile", routeGuard, (req, res, next) => {
  //console.log(req.params)
  res.redirect(`/user/${req.user.username}`);
});

module.exports = router;