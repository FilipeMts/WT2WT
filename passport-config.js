const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const nodemailer = require('nodemailer');
const User = require('./models/user');
const List = require('./models/list');
const Follow = require('./models/follow');
const bcryptjs = require('bcryptjs');

const fs = require('fs');
const handlebars = require('handlebars');

const characters = require('characters');
const movieQuote = require("popular-movie-quotes");

const renderTemplate = (path, data) => {
  const source = fs.readFileSync(path, 'utf8');
  const template = handlebars.compile(source);
  const result = template(data);
  return result;
}

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

let htmlEmail;

const sendMail = user => {
  transporter.sendMail({
    from: `wat2watch <MAIL>`,
    to: `${user.email}`,
    subject: "Email verification",
    text: "Please verify your email address by clicking this link in order to get full access to Wat2Watch",
    html: htmlEmail
    // html: `
    //   <p>Welcome to Wat2Watch</p>
    //<p><a href="http://localhost:3000/confirm/${user.confirmationCode}">Please verify your email address by clicking this link in order to get full access to Wat2Watch</a></p>`

    // html: `
    // <img src="https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fwww.owensvalleyhistory.com%2Fat_the_movies22%2Fthemovies01.png&f=1&nofb=1" width="200px"/>
    // <p><a href="http://localhost:3000/confirm/${user.confirmationCode}">Please verify your email address by clicking this link</a></p>`
  });
}

passport.serializeUser((user, callback) => {
  callback(null, user._id);
});

passport.deserializeUser((id, callback) => {
  User.findById(id)
    .then(user => {
      // console.log("================ DESERIALIZE ====================");
      // console.log(user);
      // console.log("================ END DESERIALIZE ====================");
      callback(null, user);
    })
    .catch(error => {
      callback(error);
    });
});

passport.use(
  'sign-up',
  new LocalStrategy({
    passReqToCallback: true
  }, (req, username, password, callback) => {
    const confirmToken = generateId(30);
    let userObject = {};
    const randomCharacter = characters.random();
    const randomQuote = movieQuote.getRandomQuote();
    bcryptjs
      .hash(password, 10)
      .then(hash => {
        return User.create({
          username,
          description: randomQuote,
          name: `${randomCharacter.first} ${randomCharacter.last}`,
          email: req.body.email,
          passwordHash: hash,
          confirmationCode: confirmToken
        });
      })
      .then(user => {
        console.log(user.email)
        htmlEmail = renderTemplate(__dirname + "/views/verify-email.hbs", {
          user
        });
        console.log(htmlEmail);
        sendMail(user)
        userObject = user;
        return List.create({
          user_id: user._id,
          type: 'watched'
        });
      }).then(listObject => {
        userObject.watchedList = listObject._id;
        return List.create({
          user_id: userObject._id,
          type: 'watching'
        });
      }).then(listObject => {
        userObject.watchingList = listObject._id;
        return List.create({
          user_id: userObject._id,
          type: 'to watch'
        });
      }).then(listObject => {
        userObject.towatchList = listObject._id;
        userObject.save();
        return Follow.create({
          user_id: userObject._id,
        });
      }).then(followObject => {
        callback(null, userObject);
      })
      .catch(error => {
        callback(error);
      });
  })
);

passport.use(
  'sign-in',
  new LocalStrategy({
    usernameField: 'email'
  }, (email, password, callback) => {
    let user;
    User.findOne({
        email
      })
      .then(document => {
        user = document;
        return bcryptjs.compare(password, user.passwordHash);
      })
      .then(passwordMatchesHash => {
        if (passwordMatchesHash) {
          callback(null, user);
        } else {
          callback(new Error('Passwords doesn\'t match'));
        }
      })
      .catch(error => {
        callback(error);
      });
  })
);

// GOOGLE CONFIG
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

passport.use(
  new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://wt2wtc.herokuapp.com/auth/google/redirect"
    },
    function (accessToken, refreshToken, profile, callback) {
      //console.log(profile._json.sub)
      const {
        email,
        name,
        sub,
        picture
      } = profile._json
      User.findOne({
          googleId: profile._json.sub
        })
        .then(user => {
          if (user) {
            return Promise.resolve(user);
          } else {
            return User.create({
              email: email,
              username: name,
              googleId: sub,
              passwordHash: accessToken,
              profilePic: picture
            });
          }
        })
        .then(user => {
          callback(null, user);
        })
        .catch(error => {
          callback(error);
        });
    }
  ));
/* 
//FACEBOOK CONFIG
const FacebookStrategy = require('passport-facebook').Strategy;

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/redirect"
  },
  function (accessToken, refreshToken, profile, cb) {
    console.log(profile)
  }
)); */