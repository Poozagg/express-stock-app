const request = require('supertest');
const app = require('../../app');
const db = require('../../models');
const stockController = require('../../controllers/stockController');

describe('Stock Controller', () => {
  describe('Unit Tests', () => {
    beforeAll(async () => {
      // Create test products in db for update tests
      await db.Product.create({
        id: 'TEST004',
        name: 'Product to Update',
        pricePerItem: 15.99,
        quantity: 30,
        type: 'clothing'
      });
    });

    afterAll(async () => {
      // Clean up test products from db
      await db.Product.destroy({ where: { id: 'TEST004' } });
    });
    
    test('Update a product', async() => {
      //Mock request and response objects for the update operation
      const mockReq = {
        params: {
          id: 'TEST004'
        },
        body: {
          name: 'Updated Product Name',
          pricePerItem: 12.99,
          quantity: 25,
          type: 'clothing',
          size: 'L',
          material: 'Polyester'
        }
      };

      const mockRes = { 
        redirect: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn() 
      };

      // Call the controller method directly to update it
      await stockController.update(mockReq, mockRes);

      // Verify the product was updated in the database
      const updatedProduct = await db.Product.findByPk('TEST004');
      expect(updatedProduct.name).toBe('Updated Product Name');

      // Check if the mock redirect function was called with the correct argument
      expect(mockRes.redirect).toHaveBeenCalledWith('/details/TEST004');
    });
  });
});

