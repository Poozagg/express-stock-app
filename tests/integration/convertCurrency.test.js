const request = require('supertest');
const app = require('../../app');
const db = require('../../models');
describe('Stock Controller', () => {
  // Integration Tests
  describe('Integration Tests', () => {
    beforeAll(async () => {
      // Create test products in the db
      await db.Product.create({
        id: 'INT005',
        name: 'Integration Currency Product',
        pricePerItem: 100.00,
        quantity: 10,
        type: 'electronic'
      });
      await db.Product.create({
        id: 'EDGE002',
        name: 'Edge Case Currency Product',
        pricePerItem: 50.00,
        quantity: 5,
        type: 'clothing'
      });
    });

    test('Convert product price to USD and display it', async () => {
      // Using supertest to simulate HTTP requests
      // This tests the entire request-response cycle, including routing
      const response = await request(app)
        .get('/details/INT005/convert?currency=USD')
        .expect(200);
      // Checking the response body for the converted price
      expect(response.text).toContain('USD');
      expect(response.text).toContain('Converted Price');
    });
  });
  
  // Edge Cases and Robust Testing Suggestions
  describe('Edge Cases and Robust Testing', () => {
    test('Convert currency with invalid currency code', async () => {
      // Testing error handling for unsupported currency
      const response = await request(app)
        .get('/details/EDGE002/convert?currency=FAKE')
        .expect(400); // Expecting an error status code
      expect(response.text).toContain('Invalid or Unsupported Currency');
    });
  });
});