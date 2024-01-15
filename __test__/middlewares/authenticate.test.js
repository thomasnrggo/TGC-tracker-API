const jwt = require('jsonwebtoken')
const { authenticate } = require('../../src/middlewares/authenticate')

jest.mock('jsonwebtoken')

describe('Authenticate Middleware', () => {
  let mockReq
  let mockRes
  let mockNext

  beforeEach(() => {
    mockReq = {
      headers: {
        authorization: 'Bearer testtoken',
      },
    }
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    mockNext = jest.fn()
  })

  it('should authenticate a valid token and call next()', () => {
    jwt.verify.mockImplementation(() => ({ userId: '123' }))

    authenticate(mockReq, mockRes, mockNext)

    expect(jwt.verify).toHaveBeenCalledWith('testtoken', process.env.JWT_SECRET)
    expect(mockReq).toHaveProperty('userData')
    expect(mockReq.userData).toEqual({ userId: '123' })
    expect(mockNext).toHaveBeenCalled()
  })

  it('should return 401 for an invalid token', () => {
    jwt.verify.mockImplementation(() => {
      throw new Error('Invalid token')
    })

    authenticate(mockReq, mockRes, mockNext)

    expect(jwt.verify).toHaveBeenCalledWith('testtoken', process.env.JWT_SECRET)
    expect(mockRes.status).toHaveBeenCalledWith(401)
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Authentication aksdkamk',
    })
    expect(mockNext).not.toHaveBeenCalled()
  })
})
