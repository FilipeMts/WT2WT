const { Router } = require("express");
const router = new Router();

/* const User = require("./../models/user"); */
const Mtv = require("./../models/mtv");
const Approve = require("./../models/approve");

router.post('/approve/:media_type/:id', (req, res, next) => {
  Mtv.findOrCreate(req.params)
    .then(mtvObject => {
      console.log(mtvObject)
      mtvObject.approveCount++;
      mtvObject.save();
      return Approve.create({
        user_id: req.user._id,
        mtv_id: mtvObject._id
      });      
    })
    .then(approvedObject => {
      console.log(approvedObject)
    })
    .catch(err => {
      console.log(err)
      next()
    }) 
})

module.exports = router;