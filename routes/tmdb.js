'use strict';

const tmdb = require('themoviedb-api-client')(process.env.TMDB_API_KEY);
const Mtv = require("./../models/mtv");
const List = require("./../models/list");

const {
    Router
} = require('express');
const tmdbRouter = new Router();

tmdbRouter.get('/search', (req, res, next) => {
    tmdb.searchMovie(req.query)
        .then((searchObject) => {
            res.render('tmdb/search', {
                searchObject
            })
        })
        .catch((error) => {
            console.log(error);
        });
});

module.exports = tmdbRouter;