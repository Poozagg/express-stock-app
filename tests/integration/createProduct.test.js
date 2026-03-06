const request = require('supertest');
const app = require('../../app');

describe('Stock Controller', () => {
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
  });
});

