const { Router } = require("express");
const router = new Router();

const User = require('./../models/user');
const Follow = require('./../models/follow');

router.post('/follow/:id', (req, res, next) => {
  Follow.create(req.params)
    .then(paramsObject => {
      console.log(paramsObject)
    })
})

module.exports = router;