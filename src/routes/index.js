const express = require('express')
const userRouter = require('./users')
const cardRouter = require('./cards')
const authRouter = require('./auth')
const { authenticate } = require('../middlewares/authenticate')

function routerApi(app) {
  const router = express.Router()
  app.use('/api/v1', router)

  router.use('/auth', authRouter)
  router.use('/users', authenticate, userRouter)
  router.use('/cards', authenticate, cardRouter)
}

module.exports = routerApi
