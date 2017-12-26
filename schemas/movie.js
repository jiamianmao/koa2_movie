const mongoose = require('mongoose')

let movieSchema = new mongoose.Schema({
    title: String,
    director: String,
    country: String,
    year: Number,
    poster: String,
    flash: String,
    language: String,
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
})

// Schema 的 pre 方法
// 当每次 save 的时候，都会先执行该方法
movieSchema.pre('save', function (next) {
    if (this.isNew) {
        this.meta.createdAt = Date.now()
        this.meta.updateAt = Date.now()
    } else {
        this.meta.updateAt = Date.now()
    }

    next()
})

// Schema 的静态方法
movieSchema.statics = {
    findAll: async function () {
        return this.find({}).sort('meta.createAt').exec()
    },
    findById: async function (id) {
        return this.findOne({_id: id})
    }
}

module.exports = movieSchema