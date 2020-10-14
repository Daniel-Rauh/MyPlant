const mongoose = require('mongoose')
const Schema = mongoose.Schema

const plantSchema = new Schema({
    room: String,
    name: String,
    species: String,
    picture: String,
    schedule: Array,
    needsWater: Boolean
})

const roomSchema = new Schema({
    name: String,
})

const userSchema = new Schema({
    googleId: String,
    firstName: String,
    lastName: String,
    email: String,
    picture: String,
    lastUpdated: String,
    daysSinceMiss: Number,
    rooms: [roomSchema],
    plants: [plantSchema],
})

const User = mongoose.model('user', userSchema)
module.exports = User