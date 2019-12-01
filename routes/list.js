'use strict';

const tmdb = require('themoviedb-api-client')(process.env.TMDB_API_KEY);
const Mtv = require("./../models/mtv");
const List = require("./../models/list");

const {
  Router
} = require('express');
const listRouter = new Router();
const routeGuard = require("../middleware/route-guard");

listRouter.post('/:list_id/add/:media_type/:id', routeGuard, (req, res, next) => {
  let mtvObjectId;
  Mtv.findOrCreate(req.params)
    .then(mtvObject => {
      mtvObjectId = mtvObject._id;
      return List.findById(req.params.list_id);
    }).then(list => {
      list.findMtvOrPush(mtvObjectId);
      res.redirect(`/user/${req.user.username}`);
    }).catch((error) => {
      console.log(error);
    });
});

listRouter.get('/:username/list/:list_id', (req, res, next) => {
  List.findById(req.params.list_id)
    .populate({
      path: 'mtvs',
      model: Mtv
    })
    .populate('user_id')
    .then(list => {
      res.render('list/show', {
        list
      });
    }).catch(error => {
      console.log(error);
    });
});

module.exports = listRouter;