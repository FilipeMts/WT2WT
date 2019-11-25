'use strict';

const tmdb = require('themoviedb-api-client')(process.env.TMDB_API_KEY);

const {
    Router
} = require('express');
const tmdbRouter = new Router();

tmdbRouter.get('/search', (req, res, next) => {
    tmdb.searchMovie(req.query)
        .then((searchObject) => {
            console.log(searchObject.body.results);
            res.render('tmdb/search', {
                searchObject
            })
        })
        .catch((error) => {
            console.log(error);
        });
});

module.exports = tmdbRouter;