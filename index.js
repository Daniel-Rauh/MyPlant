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
app.use(express.urlencoded( {extended: false}))
app.set('view engine', 'ejs')
app.use(passport.initialize())
app.use(passport.session())

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

app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', passport.authenticate('google'), (req, res) => {
    res.redirect('/profile')
    //console.log(req.user)
})

app.get('/profile', (req, res) => {
    console.log(req.user)
    res.status(200).render('profile', { user: req.user })
})

app.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
})