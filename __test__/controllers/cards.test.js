const User = require('../../src/models/user')
const Card = require('../../src/models/card')
const {
  addToCollection,
  removeFromCollection,
  addToWishlist,
  removeFromWishlist,
} = require('../../src/controllers/cards')

jest.mock('../../src/models/user')
jest.mock('../../src/models/card')

describe('Add To collection', () => {
  it('should add a card to a user collection', async () => {
    const req = {
      params: {
        userId: 'user1',
      },
      body: {
        id: 'card1',
        name: 'card1',
      },
    }
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    const next = jest.fn()
    Card.findOne.mockResolvedValue(null)

    Card.findOne.mockResolvedValue({
      _id: 'card1',
      save: jest.fn().mockResolvedValue({ _id: 'card1', ...req.body }),
    })

    const mockUser = {
      _id: 'user1',
      cards: [],
      wishlist: [],
      save: jest.fn(),
    }
    User.findById.mockResolvedValue(mockUser)

    await addToCollection(req, res, next)

    expect(Card.findOne).toHaveBeenCalledWith({ id: req.body.id })
    expect(User.findById).toHaveBeenCalledWith(req.params.userId)
    expect(mockUser.cards.length).toBe(1)
    expect(res.status).toHaveBeenCalledWith(201)
  })

  it('should return a 404 if user is not found', async () => {
    const req = {
      params: {
        userId: 'user1',
      },
      body: {
        id: 'card1',
        name: 'card1',
      },
    }
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    const next = jest.fn()

    User.findById.mockResolvedValue(null)

    await addToCollection(req, res, next)

    expect(res.status).toHaveBeenCalledWith(404)
  })
})

describe('Remove From collection', () => {
  it('should remove a card from a user collection', async () => {
    const req = {
      params: {
        userId: 'user1',
        cardId: 'card1',
      },
    }
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    const next = jest.fn()

    Card.findOne.mockResolvedValue({ _id: 'card1' })

    const mockUser = {
      _id: 'user1',
      cards: [{ _id: 'card1', equals: jest.fn(id => id === 'card1') }],
      save: jest.fn(),
    }
    User.findById.mockResolvedValue(mockUser)

    await removeFromCollection(req, res, next)

    expect(User.findById).toHaveBeenCalledWith(req.params.userId)
    expect(Card.findOne).toHaveBeenCalledWith({ id: req.params.cardId })
    expect(mockUser.cards.length).toBe(0)
    expect(res.status).toHaveBeenCalledWith(200)
  })
})

describe('Add To wishlist', () => {
  it('should add a card to a user wishlist', async () => {
    const req = {
      params: {
        userId: 'user1',
      },
      body: {
        id: 'card1',
        name: 'card1',
      },
    }
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    const next = jest.fn()
    Card.findOne.mockResolvedValue(null)

    Card.findOne.mockResolvedValue({
      _id: 'card1',
      save: jest.fn().mockResolvedValue({ _id: 'card1', ...req.body }),
    })

    const mockUser = {
      _id: 'user1',
      cards: [],
      wishlist: [],
      save: jest.fn(),
    }
    User.findById.mockResolvedValue(mockUser)

    await addToWishlist(req, res, next)

    expect(Card.findOne).toHaveBeenCalledWith({ id: req.body.id })
    expect(User.findById).toHaveBeenCalledWith(req.params.userId)
    expect(mockUser.wishlist.length).toBe(1)
    expect(res.status).toHaveBeenCalledWith(200)
  })
})

describe('Remove From wishlist', () => {
  it('should remove a card from a user wishlist', async () => {
    const req = {
      params: {
        userId: 'user1',
        cardId: 'card1',
      },
    }
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    const next = jest.fn()

    Card.findOne.mockResolvedValue({ _id: 'card1' })

    const mockUser = {
      _id: 'user1',
      wishlist: [{ _id: 'card1', equals: jest.fn(id => id === 'card1') }],
      save: jest.fn(),
    }
    User.findById.mockResolvedValue(mockUser)

    await removeFromWishlist(req, res, next)

    expect(User.findById).toHaveBeenCalledWith(req.params.userId)
    expect(Card.findOne).toHaveBeenCalledWith({ id: req.params.cardId })
    expect(mockUser.wishlist.length).toBe(0)
    expect(res.status).toHaveBeenCalledWith(200)
  })
})
