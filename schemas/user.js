const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const SALT_WORK_FACTOR = 10

const User = new mongoose.Schema({
    name: {
        unique: true,
        type: String
    },
    password: {
        unique: true,
        type: String
    },
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

User.pre('save', (next) => {
    const user = this
    if (this.isNew) {
        this.meta.createdAt = Date.now()
        this.meta.updateAt = Date.now()
    } else {
        this.meta.updateAt = Date.now()
    }

    // 使用bcrypt 生成一个10位数的盐
    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
        if (err) {
            return next(err)
        }
        // 将用户密码 + 盐 => 生成hash
        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) {
                return next(err)
            }
            user.password = hash
            next()
        })
    })

    next()
})

User.statics = {
    findAll: async function () {
        return this.find({}).sort('meta.createAt').exec()
    },
    findById: async function (id) {
        return this.findOne({_id: id})
    }
}

module.exports = User
