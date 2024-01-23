const User = require('../../src/models/user')
const {
  createUser,
  updateUser,
  deleteUser,
  getUser,
} = require('../../src/controllers/users')

jest.mock('../../src/models/user')

describe('getUser', () => {
  it('should return a user if it exists', async () => {
    const req = {
      params: {
        userId: 'user1',
      },
    }
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    User.findById.mockResolvedValue({
      _id: 'user1',
      username: 'user1',
      email: 'test@mail.com',
    })
    await getUser(req, res)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        _id: 'user1',
        username: 'user1',
        email: 'test@mail.com',
      })
    )
  })
})

describe('createUser', () => {
  it('should create a new user', async () => {
    const req = {
      body: {
        username: 'newuser',
        email: 'newuser@mail.com',
      },
    }
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    User.mockReturnValue({
      save: jest.fn().mockResolvedValue({ _id: 'user1', ...req.body }),
    })
    await createUser(req, res)
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        _id: 'user1',
        ...req.body,
      })
    )
    expect(User).toHaveBeenCalledWith(req.body)
  })

  it('should return a 500 if there is an error', async () => {
    const req = {
      body: {
        username: 'newuser',
        email: 'mail.com',
      },
    }
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    User.mockReturnValue({
      save: jest.fn().mockRejectedValue({ message: 'Error' }),
    })
    await createUser(req, res)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Error',
      })
    )
  })
})

describe('updateUser', () => {
  it('should update a user if it exists', async () => {
    const req = {
      params: {
        userId: 'user1',
      },
      body: {
        username: 'user1',
        email: 'test@mail.com',
      },
    }
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    User.findByIdAndUpdate.mockResolvedValue({
      _id: 'user1',
      ...req.body,
    })
    await updateUser(req, res)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        _id: 'user1',
        ...req.body,
      })
    )
  })
})

describe('deleteUser', () => {
  it('should delete a user if it exists', async () => {
    const req = {
      params: {
        userId: 'user1',
      },
    }
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    User.findByIdAndDelete.mockResolvedValue({
      _id: 'user1',
      username: 'user1',
      email: 'test@mail.com',
    })
    await deleteUser(req, res)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'User deleted successfully',
      })
    )
  })
})
