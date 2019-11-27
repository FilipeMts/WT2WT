'use strict';

const {
    Router
} = require('express');
const mtvRouter = new Router();
const Mtv = require("./../models/mtv");

mtvRouter.get('/mtv/:media_type/:id', (req, res, next) => {
    Mtv.findOrCreate(req.params).then(mtvObject => {
        console.log(mtvObject)
        res.render('mtv/show', mtvObject);
    });
});


module.exports = mtvRouter;