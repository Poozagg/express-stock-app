const request = require('supertest');
const app = require('../../app');
const db = require('../../models');
const stockController = require('../../controllers/stockController');

describe('Stock Controller', () => {
  // Unit Tests
  describe('Unit Tests', () => {
    test('Update a product', async() => {
      await db.Product.create({
        id: 'TEST003',
        name: 'Product to Update',
        price: 15.99,
        quantity: 30,
        type: 'clothing'
      });

      //Mock request and response objects for the update operation
      const mockReq = {
        params: {
          id: 'TEST003'
        },
        body: {
          name: 'Updated Product Name',
          price: 12.99,
          quantity: 25,
          type: 'clothing',
          size: 'L',
          material: 'Polyester'
        }
      };

      const mockRes = { redirect: jest.fn() };

      // Call the controller method directly to update it
      await stockController.update(mockReq, mockRes);

      // Verify the product was updated in the database
      const updatedProduct = await db.Product.findByPk('TEST003');
      expect(updatedProduct.name).toBe('Updated Product Name');

      // Check if the mock redirect function was called with the correct argument
      expect(mockRes.redirect).toHaveBeenCalledWith('/');
    });
  });
});


