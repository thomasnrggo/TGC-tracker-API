describe('Database Connection Configuration', () => {
    let originalEnv;

    beforeAll(() => {
        originalEnv = process.env;
    });

    afterAll(() => {
        process.env = originalEnv;
    });

    it('Should create a valid MongoDB URI', () => {
        process.env.MONGO_USER = 'testuser';
        process.env.MONGO_PASSWORD = 'testpassword';
        process.env.MONGO_CLUSTER = 'testcluster';

        const { uri } = require('../../src/config/connection');

        const expected = 'mongodb+srv://testuser:testpassword@testcluster/?retryWrites=true&w=majority';
        expect(uri).toEqual(expected);
    });
});