require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const routerApi = require('./src/routes')
const connection = require('./src/config/connection')

const app = express()

const PORT = process.env.PORT || 3000

// middleware
app.use(bodyParser.json())
app.use(cors())

app.get('/', (req, res) => {
  res.send('Welcome to TGC Tracker API!, api has been initialized!')
})

mongoose
  .connect(connection.uri)
  .then(() => {
    routerApi(app)

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })
  })
  .catch(err => console.log(err))
