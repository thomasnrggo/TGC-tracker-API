const jwt = require('jsonwebtoken')

const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.userData = decoded
    next()
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed' })
  }
}

exports.authenticate = authenticate
