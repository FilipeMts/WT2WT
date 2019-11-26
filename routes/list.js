'use strict';

const tmdb = require('themoviedb-api-client')(process.env.TMDB_API_KEY);
const Mtv = require("./../models/mtv");
const List = require("./../models/list");

const {
  Router
} = require('express');
const listRouter = new Router();
const routeGuard = require("../middleware/route-guard");

listRouter.post('/:list_id/add/:id', routeGuard, (req, res, next) => {
  Mtv.findOrCreate(req.params)
    .then(mtvObject => {
      console.log("mtvObject -------------> ", mtvObject);
      return List.findByIdAndUpdate(req.params.list_id, {
        $push: {
          mtvs: mtvObject.id
        }
      });
    }).then(list => {
      console.log(list);
      res.redirect(`/${req.session.passport.user.username}/list/${list._id}`);
    }).catch((error) => {
      console.log(error);
    });
});

listRouter.get('/:username/list/:list_id', (req, res, next) => {
  res.render('list/show', req.params);
});

module.exports = listRouter;