'use strict';

const tmdb = require('themoviedb-api-client')(process.env.TMDB_API_KEY);
const Mtv = require("./../models/mtv");
const List = require("./../models/list");

const {
    Router
} = require('express');
const listRouter = new Router();

const mtvExists = require("../middleware/mtvExists");

listRouter.post(':list_id/add/:mtv_id', (req, res, next) => {
    const {
        list_id,
        mtv_id
    } = req.params;
    List.findByIdAndUpdate(list_id, {
        $push: {
            mtvs: mtv_id
        }
    }).then(list => {
        console.log(list);
    }).catch((error) => {
        console.log(error);
    });
});

module.exports = listRouter;