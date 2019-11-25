const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('./models/user');
const bcryptjs = require('bcryptjs');

const generateId = length => {
  const characters =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let token = "";
  for (let i = 0; i < length; i++) {
    token += characters[Math.floor(Math.random() * characters.length)];
  }
  return token;
};

passport.serializeUser((user, callback) => {
  callback(null, user._id);
});

passport.deserializeUser((id, callback) => {
  User.findById(id)
    .then(user => {
      callback(null, user);
    })
    .catch(error => {
      callback(error);
    });
});

passport.use(
  'sign-up',
  new LocalStrategy( { passReqToCallback: true },(req, username, password, callback) => {
    const confirmToken = generateId(30);  
    bcryptjs
      .hash(password, 10)
      .then(hash => {
        return User.create({
          username,
          email: req.body.email,
          passwordHash: hash,
          confirmationCode: confirmToken
        });
      })
      .then(user => {
        callback(null, user);
      })
      .catch(error => {
        callback(error);
      });
  })
);

passport.use(
  'sign-in',
  new LocalStrategy({ usernameField: 'email' }, (email, password, callback) => {
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
  callbackURL: "http://localhost:3000/auth/google/redirect"
},
function(accessToken, refreshToken, profile, callback) {
  //console.log(profile._json.sub)
  const {email, name, sub, picture} = profile._json
  User.findOne({ googleId: profile._json.sub })
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

//FACEBOOK CONFIG
const FacebookStrategy = require('passport-facebook').Strategy;

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: "http://localhost:3000/auth/facebook/redirect"
},
function(accessToken, refreshToken, profile, cb) {
  console.log(profile)
}
));