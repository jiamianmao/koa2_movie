const mongoose = require('mongoose')
const UserSchema = require('../schemas/user')
const User = UserSchema.model('User', UserSchema)

modules.exports = User
