'use strict'

const { Router } = require("express");
const router = new Router();
const nodemailer = require('nodemailer')
const User = require("./../models/user");
const bcryptjs = require("bcryptjs");

//S Set NODEMAILER
const generateId = length => {
  const characters =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let token = "";
  for (let i = 0; i < length; i++) {
    token += characters[Math.floor(Math.random() * characters.length)];
  }
  return token;
};

let transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
});

const sendMail = user => {
  transporter.sendMail({
    from: `TEST <MAIL>`,
    to: `${user.email}`,
    subject: "Email verification",
    html: `
      <p>Testing 123</p>
      <p><a href="http://localhost:3000/confirm/${user.confirmationCode}">Please verify your email address by clicking this link</a></p>`
    
    // html: `
    // <img src="https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fwww.owensvalleyhistory.com%2Fat_the_movies22%2Fthemovies01.png&f=1&nofb=1" width="200px"/>
    // <p><a href="http://localhost:3000/confirm/${user.confirmationCode}">Please verify your email address by clicking this link</a></p>`
  });
}

router.get("/success", (req, res, next) => {
  res.render("success");
  //console.log(req.user);
});
/*
router.get("/confirm/:token", (req, res, next) => {
  const token = req.params.token;  
  User.findOneAndUpdate({confirmationCode: token}, 
    { 
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
*/

//SET PASSPORT
const passport = require('passport');

router.get('/sign-in', (req, res, next) => {
  res.render('./auth/sign-in');
});

router.post(
  '/sign-in',
  passport.authenticate('sign-in', {
    successRedirect: '/profile',
    failureRedirect: '/sign-in'
  })
);

router.get('/sign-up', (req, res, next) => {
  res.render('./auth/sign-up');
});

router.post(
  '/sign-up',
  passport.authenticate('sign-up', {
    successRedirect: '/',
    failureRedirect: './auth/sign-up'
  })
);

//GOOGLE SIGNUP/IN
router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', "email"]}));

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

// LOCAL SIGNUP
router.get('/sign-up', (req, res, next) => {
  res.render('./auth/sign-up');
});

router.post("/sign-up", (req, res, next) => {
  const { username, email, password } = req.body;
  const confirmToken = generateId(30);
  bcryptjs
    .hash(password, 15)
    .then(hash => {
      return User.create({
        username,
        email,
        passwordHash: hash,
        confirmationCode: confirmToken
      });
    })
    .then(user => {
      //sendMail(user);
      req.session.user = user._id;
      res.redirect('/');
    })
    .catch(error => {
      next(error);
    });
});

// LOCAL SIGNIN
router.get('/sign-in', (req, res, next) => {
  res.render('./auth/sign-in');
});

router.post("/sign-in", (req, res, next) => {
  let userId;
  const { email, password } = req.body;
  console.log(email, password)
  User.findOne({ email })
    .then(user => {
      if (!user) {
        return Promise.reject(new Error("User not found!"));
      } 
      else {        
        userId = user._id;
        return bcryptjs.compare(password, user.passwordHash);
      }
    })
    .then(result => {
      if (result) {
        req.session.user = userId;
        res.redirect("/profile");
      } 
      else {
        return Promise.reject(new Error("Wrong password."));
      }
    })
    .catch(error => {
      next(error);
    });
});


// SIGNOUT
router.post("/sign-out", (req, res, next) => {
  req.session.destroy();
  res.redirect("/");
});

router.get("/profile", (req, res, next) => {
  res.render("profile");
});

const routeGuard = require("../middleware/route-guard");

router.get("/profile", routeGuard, (req, res, next) => {
  res.render("profile");
});

module.exports = router;