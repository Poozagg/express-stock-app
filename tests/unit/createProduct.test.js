const request = require('supertest');
const app = require('../../app');
const db = require('../../models');
const stockController = require('../../controllers/stockController');

describe('Stock Controller', () => {
  describe('Unit Tests', () => {
    test('Create a new product', async () => {
      // Mocking the request and response objects
      // This allows us to test the controller function in isolation
      const mockReq = {
        body: {
          id: 'TEST001',
          name: 'Test Product',
          price: 9.99,
          quantity: 100,
          type: 'clothing'
        }
      };
      const mockRes = {
        // Jest mock function to simulate the redirect method
        redirect: jest.fn()
      };

      // Call the controller method directly
      await stockController.create(mockReq, mockRes);

      // Verify the product was created in the database
      const product = await db.Product.findByPk('TEST001');
      expect(product).not.toBeNull();
      expect(product.name).toBe('Test Product');
      // Check if the mock redirect function was called with the correct argument
      expect(mockRes.redirect).toHaveBeenCalledWith('/');
    });
  });
});
