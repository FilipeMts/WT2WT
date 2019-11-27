const {
  Router
} = require("express");
const router = new Router();

/* const User = require("./../models/user"); */
const Mtv = require("./../models/mtv");
const Approve = require("./../models/approve");
const Suggestion = require("./../models/suggestion");
const User = require("./../models/user");

router.post('/approve/:media_type/:id', (req, res, next) => {
  let approved;
  Mtv.findOrCreate(req.params)
    .then(mtvObject => {
      return Approve.findOrCreate(mtvObject._id, req.user._id);
    })
    .then(approvedObject => {
      approved = approvedObject;
      return User.findFollowers(req.user._id);
    })
    .then(users => {
      users.map(value => {
        Suggestion.findOrCreate(approved.mtv_id, value.user_id, approved.user_id);
      });
      res.redirect(`/mtv/${req.params.media_type}/${req.params.id}`);
    })
    .catch(err => {
      console.log(err)
      next()
    });
});

router.post('/disapprove/:media_type/:id', (req, res, next) => {
  Mtv.findOrCreate(req.params)
    .then(mtvObject => {
      mtvObject.approveCount--;
      mtvObject.save();
      return Approve.findOneAndDelete({
        $and: [{
          user_id: req.user._id
        }, {
          mtv_id: mtvObject._id
        }]
      });
    }).then(approvedObject => {
      console.log("================= FIND ONE AND DELETE =================");
      console.log(`/mtv/${req.params.media_type}/${req.params.id}`);
      console.log("================= END FIND ONE AND DELETE =================");
      res.redirect(`/mtv/${req.params.media_type}/${req.params.id}`);
    })
    .catch(err => {
      console.log(err)
    });
});

module.exports = router;