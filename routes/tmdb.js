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
            //console.log(searchObject.body.results);
            res.render('tmdb/search', {
                searchObject
            })
        })
        .catch((error) => {
            console.log(error);
        });
});

const mtvExists = require("../middleware/mtvExists");

tmdbRouter.post('/create/:id', mtvExists, (req, res, next) => {
    tmdb.movieInfo(req.params)
        .then(movieObject => {
            const {
                id,
                title,
                media_type,
                imdb_id
            } = movieObject.body;

            return Mtv.create({
                tmdb_id: id,
                title,
                type: media_type,
                imdb_id,
                tmdbData: movieObject.body
            });
        }).then(mtv => {
            return List.findOne({
                user_id: req.session.passport.user,
                type: 'watching'
            }, {
                $push: {
                    mtvs: mtv
                }
            });
        }).then(list => {
            console.log(list);
        }).catch((error) => {
            console.log(error);
        });
});

module.exports = tmdbRouter;