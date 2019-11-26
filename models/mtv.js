'use strict';

//const findOrCreate = require('mongoose-findorcreate');
const tmdb = require('themoviedb-api-client')(process.env.TMDB_API_KEY);
const mongoose = require('mongoose');

const mtvSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    tmdb_id: {
        type: Number,
        required: true,
        unique: true
    },
    imdb_id: {
        type: String,
        //required: true,
        unique: true,
        trim: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        enum: ['Movie', 'TV']
    },
    approveCount: {
        type: Number,
        default: 0
    },
    tmdbData: mongoose.Mixed
}, {
    timestamps: true
});

//mtvSchema.plugin(findOrCreate);
mtvSchema.static('findOrCreate', function (idObject) {
    return this.findById(idObject.id)
        .then(mtv => {
            if (!mtv) {
                // If no mtv was found, return a rejection with an error to the error handler at the end
                tmdb.movieInfo({
                    id: idObject.id
                }).then(movieObject => {
                    const {
                        id,
                        title,
                        media_type,
                        imdb_id
                    } = movieObject.body;

                    return Mtv.create({
                        _id: id.toString(),
                        tmdb_id: id,
                        title,
                        type: media_type,
                        imdb_id,
                        tmdbData: movieObject.body
                    });
                }).catch(error => {
                    console.log(error);
                })
            } else {
                // If there's one, resolve promise with the value
                return mtv;
            }
        })
        .catch(error => {
            console.log(error);
        });
});

const Mtv = mongoose.model('Mtv', mtvSchema);

module.exports = Mtv;