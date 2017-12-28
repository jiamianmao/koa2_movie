const mongoose = require('mongoose')
const movieSchema = require('../schemas/movie')

let movieModel = mongoose.model('movie', movieSchema)

module.exports = movieModel