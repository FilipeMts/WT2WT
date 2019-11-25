const Mtv = require("./../models/mtv");
module.exports = (req, res, next) => {
  Mtv.findOne({
    tmdb_id: req.params.id
  }).then(mtvObject => {
    if (mtvObject) {
      res.redirect('/');
    } else {
      next();
    }
  }).catch(error => {
    next();
  });
};