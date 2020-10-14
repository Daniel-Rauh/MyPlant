const express = require('express')
const app = express()
require('dotenv').config()
const mongoose = require('mongoose')
const port = process.env.PORT || 3000
const passportSetup = require('./config/passportSetup')
const passport = require('passport')
const cookieSession = require('cookie-session')
const User = require('./models/user')

app.use(cookieSession({
    name: 'session',
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIE_KEY]
}))

app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.set('view engine', 'ejs')
app.use(passport.initialize())
app.use(passport.session())

const dayArr = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"]
let day = dayArr[new Date().getDay()]

mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => {
        console.log("I am connect")
        app.listen(port, () => {
            console.log(`listening at http://localhost:${port}/`)
        })
    })
    .catch(err => console.log(err))


app.get('/', (req, res) => {
    res.status(200).render('index')
})
app.get('/house', (req, res) => {
    User.find({ googleId: req.user.googleId })
        .catch(err => console.log(err))
        .then((result) => {
            res.status(200).render('house', {data: result[0], today: day})
        })
})

app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', passport.authenticate('google'), (req, res) => {
    res.redirect('/house')
})

app.get('/profile', (req, res) => {
    res.status(200).render('profile', { user: req.user })
})

app.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
})

app.get('/newRoom', (req, res) => {
    res.status(200).render('newRoom')
})

app.get('/myHome', (req, res) => {
    User.find({ googleId: req.user.googleId })
        .catch(err => console.log(err))
        .then((result) => {
            res.status(200).render('myHome', {data: result[0]})
        })
})

app.post('/newRoom', (req, res) => {
    User.find({ googleId: req.user.googleId })
        .catch(err => console.log(err))
        .then((result) => {
            if (result[0].rooms === undefined) {
                const newRooms = []
                newRooms.push(req.body)
                User.findByIdAndUpdate(result[0]._id, { rooms: newRooms })
                    .then((result) => {
                        console.log('Rooms updated')
                        res.status(201).redirect('/newRoom')
                    })
            } else {
                const newRooms = result[0].rooms
                newRooms.push(req.body)
                User.findByIdAndUpdate(result[0]._id, { rooms: newRooms })
                    .then((result) => {
                        console.log('Rooms updated')
                        res.status(201).redirect('/newRoom')
                    })
            }
        })
})

app.get('/newPlant', (req, res) => {
    res.status(200).render('newPlant')
})

app.post('/newPlant/:id', (req, res) => {
    User.find({googleId: req.user.googleId})
        .catch(err => console.log(err))
        .then((result) => {
            let resultRoom = ""
            for (let i = 0; i < result[0].rooms.length; i++) {
                if (result[0].rooms[i]._id == req.params.id) {
                    resultRoom = result[0].rooms[i].name
                }
            }
            if (result[0].plants === undefined) {
                let newPlants = []
                let newPlant = {
                    room: resultRoom,
                    name: req.body.name,
                    species: req.body.species,
                    picture: req.body.picture,
                    schedule: req.body.schedule,
                    needsWater: false
                }
                newPlants.push(newPlant)
                User.findByIdAndUpdate(result._id, { plants: newPlants })
                    .catch(err => console.log(err))
                    .then(console.log('Plants updated'))
            } else {
                let newPlants = result[0].plants
                let newPlant = {
                    room: resultRoom,
                    name: req.body.name,
                    species: req.body.species,
                    picture: req.body.picture,
                    schedule: req.body.schedule,
                    needsWater: false
                }
                newPlants.push(newPlant)
                User.findByIdAndUpdate(result[0]._id, { plants: newPlants })
                    .catch(err => console.log(err))
                    .then(console.log('Plants updated'))
            }
        })
})