const express = require('express')
const app = express()
require('dotenv').config()
const mongoose = require('mongoose')
const port = process.env.PORT || 3000

mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => {
        console.log("I am connect")
        app.listen(port, () => {
            console.log(`listening at http://localhost:${port}/`)
        })
    })
    .catch(err => console.log(err))

app.get('/', (req, res) => {
    res.status(200).send('Hello Plant!')
})