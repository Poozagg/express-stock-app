const request = require('supertest');
const app = require('../app');
const db = require('../models');
const stockController = require('../controllers/stockController');

// Jest hook to run before all tests
beforeAll(async () => {
  // Sync the database and force true to drop existing tables
  await db.sequelize.sync({ force: true });
});

describe('Stock Controller', () => {
  // Unit Tests
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

    test('Delete a product', async() => {
      // to delete a product, we first need to create it in the database
      // directly calls the Sequelize model to create a product without going through the controller
      await db.Product.create({
        id: 'TEST002',
        name: 'Product to Delete',
        price: 5.99,
        quantity: 20,
        type: 'electronic'
      });

      // Mocking the request and response objects for the delete operation
      mockReq = {
        params: {
          id: 'TEST002'
        }
      };

      mockRes = {
        redirect: jest.fn()
      };

      // Call the controller method directly to delete it
      await stockController.delete(mockReq, mockRes);

      // Verify the product was deleted in the database
      const product = await db.Product.findByPk('TEST002');
      expect(product).toBeNull();
    });
    
    // More unit tests...
  });

  // Integration Tests
  describe('Integration Tests', () => {
    test('Create a product and retrieve it', async () => {
      // Using supertest to simulate HTTP requests
      // This tests the entire request-response cycle, including routing
      const newProduct = {
        id: 'INT001',
        name: 'Integration Test Product',
        price: 19.99,
        quantity: 50,
        type: 'electronic'
      };

      await request(app)
        .post('/create')
        .send(newProduct)
        .expect(302); // Expecting a redirect status code

      const response = await request(app)
        .get('/')
        .expect(200);

      // Checking the response body for the created product
      expect(response.text).toContain('Integration Test Product');
    });

    // More integration tests...
    test('Delete a product and check if its deleted ', async () => {
      // Using supertest to simulate HTTP requests
      // This tests the entire request-response cycle, including routing
      const deleteProduct = {
        id: 'INT002',
        name: 'Integration Test for Product Deletion',
        price: 10.99,
        quantity: 20,
        type: 'electronic'
      };

      await db.Product.create(deleteProduct);

      await request(app)
        .post('/delete/INT002')
        .expect(302); // Expecting a redirect status code

      const deleteResponse = await request(app)
        .get('/')
        .expect(200);

      // Checking the response body for the created product
      expect(deleteResponse.text).not.toContain('Integration Test for Product Deletion');

      // Verify the product was deleted in the database
      const product = await db.Product.findByPk('INT002');
      expect(product).toBeNull();
    });
  });

  // Edge Cases and Robust Testing Suggestions
  describe('Edge Cases and Robust Testing', () => {
    test('Create a product with invalid data', async () => {
      // Testing error handling and validation
      const invalidProduct = {
        id: 'INVALID001',
        name: 'Invalid Product',
        // Missing required fields: price, quantity, type
      };

      const response = await request(app)
        .post('/create')
        .send(invalidProduct)
        .expect(500); // Expecting an error status code

      expect(response.text).toContain('Error creating product');
    });

    // More edge case tests...

    test('Delete a product also removes associated CLothing record', async () => {
      // Create product WITH associated clothing
      await db.Product.create({
        id: 'EDGE001',
        name: 'Clothing Item',
        price: 20.00,
        quantity: 5,
        type: 'clothing'
      });
      await db.Clothing.create({
        ProductId: 'EDGE001',
        size: 'M',
        material: 'Cotton'
      });
      // Delete the product
      await request(app)
        .post('/delete/EDGE001')
        .expect(302);
      // Verify BOTH are deleted
      const product = await db.Product.findByPk('EDGE001');
      const clothing = await db.Clothing.findOne({ where: { ProductId: 'EDGE001' } });
      expect(product).toBeNull();
      expect(clothing).toBeNull();
    });
  });
});

// Jest hook to run after all tests
afterAll(async () => {
  // Close the database connection
  await db.sequelize.close();
});

