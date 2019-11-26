'use strict';

//const findOrCreate = require('mongoose-findorcreate');
const tmdb = require('themoviedb-api-client')(process.env.TMDB_API_KEY);
const mongoose = require('mongoose');

const mtvSchema = new mongoose.Schema({
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
    media_type: {
        type: String,
        enum: ['movie', 'tv']
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
    return this.findOne({
            tmbd_id: idObject.id,
            media_type: idObject.media_type
        })
        .then(mtv => {
            if (!mtv) {
                // If no mtv was found, return a rejection with an error to the error handler at the end
                return tmdb.movieInfo({
                        id: idObject.id
                    }).then(movieObject => {
                        const {
                            id,
                            title,
                            imdb_id
                        } = movieObject.body;
                        return Mtv.create({
                            tmdb_id: id,
                            title,
                            media_type: idObject.media_type,
                            imdb_id,
                            tmdbData: movieObject.body
                        });
                    }).then(mtvObject => {
                        return mtvObject;
                    })
                    .catch(error => {
                        console.log(error);
                    });
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