const request = require('supertest');
const app = require('../../app');
const db = require('../../models');

describe('Stock Controller', () => {
  describe('Integration Tests', () => {
    beforeAll(async () => {
      // Create a test product in the database to update
      await db.Product.create({
        id: 'INT003',
        name: 'Integration Test for Product Update',
        pricePerItem: 15.99,
        quantity: 30,
        type: 'clothing'
      });
    });

    afterAll(async () => {
      // Clean up the test product from the database
      await db.Product.destroy({ where: { id: 'INT003' } });
    });

    test('Update a product and check if it is updated', async () => {
      // Using supertest to simulate HTTP requests
      // This tests the entire request-response cycle, including routing
      await request(app)
        .post('/update/INT003')
        .send({
          name: 'Updated Integration Test Product',
          pricePerItem: 12.99,
          quantity: 25,
          type: 'electronic',
          size: 'M',
          material: 'Cotton'
        })
        .expect(302); // Expecting a redirect status code

      const updateResponse = await request(app)
        .get('/update/INT003')
        .expect(200);

      // Checking the response body for the updated product
      expect(updateResponse.text).toContain('Updated Integration Test Product');
    });
  });

  // Edge Cases and Robust Testing Suggestions
  describe('Edge Cases and Robust Testing', () => {
    test('Update a non-existent product and check for error handling', async () => {
      await request(app)
        .post('/update/NONEXISTENT')
        .send({
          name: 'Non-existent Product',
          pricePerItem: 9.99,
          quantity: 10,
          type: 'clothing',
          size: 'L',
          material: 'Polyester'
        })
        .expect(404); // Expecting a not found status code
    });
  });
});


