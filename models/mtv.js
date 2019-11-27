'use strict';

const tmdb = require('themoviedb-api-client')(process.env.TMDB_API_KEY);
const mongoose = require('mongoose');

const mtvSchema = new mongoose.Schema({
    tmdb: {
        type: Number,
        required: true
        //unique: true
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
    tmdbData: mongoose.Mixed,
    social_ids: mongoose.Mixed
}, {
    timestamps: true
});

mtvSchema.static('isMovieOrTv', function (tmdb_id, media_type) {
    const Mtv = this;
    if (media_type === 'movie') {
        return tmdb.movieInfo({
            id: tmdb_id
        });
    } else if (media_type === 'tv') {
        return tmdb.tvInfo({
            id: tmdb_id
        });
    };
});

mtvSchema.static('oneMoreApprove', function (id) {
    const Mtv = this;
    return Mtv.findById(id)
        .then(mtv => {
            if (!mtv) {
                return Promise.reject("There's no mtv with that id");
            } else {
                mtv.approveCount++;
                return mtv.save();
            }
        })
        .catch(error => {
            console.log(error);
        });
});

mtvSchema.static('oneLessApprove', function (id) {
    const Mtv = this;
    return Mtv.findById(id)
        .then(mtv => {
            if (!mtv) {
                return Promise.reject("There's no mtv with that id");
            } else {
                mtv.approveCount--;
                return mtv.save();
            }
        })
        .catch(error => {
            console.log(error);
        });
});

mtvSchema.static('findOrCreate', function (idObject) {
    const Mtv = this;
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
                return Mtv.isMovieOrTv(idObject.id, idObject.media_type)
                    .then(tmdbObject => {
                        const {
                            id,
                            title,
                            name
                        } = tmdbObject.body;
                        return this.create({
                            tmdb: id,
                            title: idObject.media_type === 'movie' ? title : name,
                            media_type: idObject.media_type,
                            tmdbData: tmdbObject.body
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