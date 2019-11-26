'use strict';

const tmdb = require('themoviedb-api-client')(process.env.TMDB_API_KEY);
const mongoose = require('mongoose');

const mtvSchema = new mongoose.Schema({
    tmdb: {
        type: Number,
        required: true
        //unique: true
    },
    imdb: {
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
        enum: ['movie', 'tv'],
        trim: true
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
    return Mtv.findOne({
            $and: [{
                tmdb: idObject.id
            }, {
                media_type: idObject.media_type
            }]
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
                        return this.create({
                            tmdb: id,
                            title,
                            media_type: idObject.media_type,
                            imdb: imdb_id,
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