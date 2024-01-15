const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../../src/models/user');
const authController = require('../../src/controllers/auth');

jest.mock('jsonwebtoken');
jest.mock('bcrypt');
jest.mock('../../src/models/user', () => {
  return jest.fn().mockImplementation(() => ({
    save: jest.fn().mockResolvedValue(true),
    toObject: jest.fn().mockReturnValue({ id: 'mockUserId', username: 'mockUsername' })
  }));
});

describe('Auth Controller', () => {
  describe('signup', () => {
    it('should create a new user and return a token if user does not exist', async () => {
            const req = {
                body: {
                username: 'newuser',
                email: 'newuser@example.com',
                password: 'password123'
                }
            };
            const res = {
                json: jest.fn(),
                status: jest.fn().mockReturnThis()
            };

            // Mock User.findOne to simulate user not existing
            User.findOne = jest.fn().mockResolvedValue(null);
            // Mock bcrypt and jwt
            bcrypt.hash = jest.fn().mockResolvedValue('hashedpassword');
            jwt.sign = jest.fn().mockReturnValue('token');

            // Call the signup function
            await authController.signup(req, res);

            // Assertions
            expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                user: expect.any(Object),
                token: 'token'
            }));
        });

        it('should return a 400 status if the user already exists', async () => {
                // Setup mock request and response
                const req = {
                body: {
                username: 'existinguser',
                email: 'existinguser@example.com',
                password: 'password123'
                }
                };
                const res = {
                json: jest.fn(),
                status: jest.fn().mockReturnThis()
                };
                // Mock User.findOne to simulate user existing
                User.findOne = jest.fn().mockResolvedValue({ email: 'existinguser@example.com' });

                // Call the signup function
                await authController.signup(req, res);

                // Assertions
                expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
                expect(res.status).toHaveBeenCalledWith(400);
                expect(res.json).toHaveBeenCalledWith({ message: 'User already exists' });
            });
    });

    describe('login', () => {
        it('should log in a user and return a token', async () => {
            const req = {
                body: { email: 'user@example.com', password: 'password123' },
            };
            const jsonMock = jest.fn();
            const statusMock = jest.fn(() => ({ json: jsonMock }));
            const res = { status: statusMock };

            const mockUser = {
                _id: '1',
                email: 'user@example.com',
                password: 'hashedpassword123',
                toObject: () => ({ _id: '1' }),
            };

            User.findOne.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(true);
            jwt.sign.mockReturnValue('token123');

            await authController.login(req, res);

            expect(User.findOne).toHaveBeenCalledWith({ email: 'user@example.com' });
            expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedpassword123');
            expect(jwt.sign).toHaveBeenCalledWith({ id: '1' }, process.env.JWT_SECRET, { expiresIn: '1d' });
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({
                user: { _id: '1' },
                token: 'token123',
            });
        });

        it('should return 401 if the password is incorrect', async () => {
            // Setup
            const req = {
            body: { email: 'user@example.com', password: 'wrongpassword' },
            };
            const jsonMock = jest.fn();
            const statusMock = jest.fn(() => ({ json: jsonMock }));
            const res = { status: statusMock };

            const mockUser = {
            _id: '1',
            email: 'user@example.com',
            password: 'hashedpassword123',
            };

            User.findOne.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(false);

            // Act
            await authController.login(req, res);

            // Assert
            expect(User.findOne).toHaveBeenCalledWith({ email: 'user@example.com' });
            expect(bcrypt.compare).toHaveBeenCalledWith('wrongpassword', 'hashedpassword123');
            expect(statusMock).toHaveBeenCalledWith(401);
            expect(jsonMock).toHaveBeenCalledWith({ message: 'Authentication failed' });
        });

        it('should return 401 if the user does not exist', async () => {
            // Setup
            const req = {
                body: { email: 'nonexistent@example.com', password: 'password123' },
            };
            const jsonMock = jest.fn();

            const statusMock = jest.fn(() => ({ json: jsonMock }));
            const res = { status: statusMock };

            User.findOne.mockResolvedValue(null);

            await authController.login(req, res);

            // Assert
            expect(User.findOne).toHaveBeenCalledWith({ email: 'nonexistent@example.com' });
            expect(statusMock).toHaveBeenCalledWith(401);
            expect(jsonMock).toHaveBeenCalledWith({ message: 'User does not exist' });
        });
    });
        
});