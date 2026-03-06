const request = require('supertest');
const app = require('../../app');
const db = require('../../models');
const stockController = require('../../controllers/stockController');
describe('Stock Controller', () => {
  describe('Unit Tests', () => {
    test('Convert product price to USD', async () => {
      // Create a product directly in the database
      await db.Product.create({
        id: 'TEST006',
        name: 'Currency Test Product',
        price: 10.00,
        quantity: 5,
        type: 'electronic'
      });
      // Mocking the request and response objects
      // This allows us to test the controller function in isolation
      const mockReq = {
        params: { id: 'TEST006' },
        query: { currency: 'USD' }
      };
      const mockRes = {
        render: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      };
      // Call the controller method directly
      await stockController.convertCurrency(mockReq, mockRes);
      // Verify render was called with correct arguments
      expect(mockRes.render).toHaveBeenCalledWith('details',
        expect.objectContaining({
          targetCurrency: 'USD',
          originalCurrency: 'GBP'
        })
      );
    });
  });
});