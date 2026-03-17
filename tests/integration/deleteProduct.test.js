const request = require('supertest');
const app = require('../../app');
const db = require('../../models');

describe('Stock Controller', () => {
  describe('Integration Tests', () => {
    // create test product in db
    beforeAll(async () => {
      await db.Product.create({
        id: 'INT002',
        name: 'Integration Test for Product Deletion',
        pricePerItem: 10.99,
        quantity: 20,
        type: 'electronic'
      });
      await db.Product.create({
        id: 'EDGE001',
        name: 'Edge Case Product for Deletion',
        pricePerItem: 25.00,
        quantity: 5,
        type: 'clothing'
      });
      await db.Clothing.create({
        ProductId: 'EDGE001',
        size: 'M',
        material: 'Cotton'
      });
    });

    test('Delete a product and check if its deleted ', async () => {
      // Using supertest to simulate HTTP requests
      // This tests the entire request-response cycle, including routing
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
    
  // Edge Cases and Robust Testing Suggestions
  describe('Edge Cases and Robust Testing', () => {
    test('Delete a product also removes associated CLothing record', async () => {
      // Verify Clothing exists before delete
      const clothingBefore = await db.Clothing.findOne({ where: { ProductId: 'EDGE001' } });
      expect(clothingBefore).not.toBeNull();

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
});
