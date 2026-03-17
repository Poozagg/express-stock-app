const request = require('supertest');
const app = require('../../app');
const db = require('../../models');

describe('Sort Controller - Integration Tests', () => {
    beforeAll(async () => {
        // Create test products in db
        await db.Product.create({ id: 'SORT001', name: 'Apple', pricePerItem: 30.00, quantity: 10, type: 'grocery' });
        await db.Product.create({ id: 'SORT002', name: 'Banana', pricePerItem: 10.00, quantity: 20, type: 'grocery' });
        await db.Product.create({ id: 'SORT003', name: 'Cherry', pricePerItem: 20.00, quantity: 15, type: 'grocery' });
    });

    afterAll(async () => {
      // Clean up test products from db
      await db.Product.destroy({ where: { id: ['SORT001', 'SORT002', 'SORT003'] } });
    });
      
    describe('Sort by Name', () => {
        test('GET /sort?sortBy=name&sortOrder=asc returns products sorted A-Z', async () => {
            const response = await request(app)
            .get('/sort?sortBy=name&sortOrder=asc')
            .expect(200);
            // Check that Apple appears before Banana in the HTML
            const appleIndex = response.text.indexOf('Apple');
            const bananaIndex = response.text.indexOf('Banana');
            const cherryIndex = response.text.indexOf('Cherry');
            expect(appleIndex).toBeLessThan(bananaIndex);
            expect(bananaIndex).toBeLessThan(cherryIndex);
        });

        test('GET /sort?sortBy=name&sortOrder=desc returns products sorted Z-A', async () => {
          const response = await request(app)
            .get('/sort?sortBy=name&sortOrder=desc')
            .expect(200);
          // Check that Cherry appears before Banana in the HTML
          const cherryIndex = response.text.indexOf('Cherry');
          const bananaIndex = response.text.indexOf('Banana');
          const appleIndex = response.text.indexOf('Apple');
          expect(cherryIndex).toBeLessThan(bananaIndex);
          expect(bananaIndex).toBeLessThan(appleIndex);
        });
    });
      
    describe('Sort by Price', () => {
        test('GET /sort?sortBy=pricePerItem&sortOrder=asc returns products low to high', async () => {
          const response = await request(app)
            .get('/sort?sortBy=pricePerItem&sortOrder=asc')
            .expect(200);
          // Banana (10) < Cherry (20) < Apple (30)
          const bananaIndex = response.text.indexOf('Banana');
          const cherryIndex = response.text.indexOf('Cherry');
          const appleIndex = response.text.indexOf('Apple');
          expect(bananaIndex).toBeLessThan(cherryIndex);
          expect(cherryIndex).toBeLessThan(appleIndex);
        });

        test('GET /sort?sortBy=pricePerItem&sortOrder=desc returns products high to low', async () => {
          const response = await request(app)
            .get('/sort?sortBy=pricePerItem&sortOrder=desc')
            .expect(200);
          // Apple (30) > Cherry (20) > Banana (10)
          const appleIndex = response.text.indexOf('Apple');
          const cherryIndex = response.text.indexOf('Cherry');
          const bananaIndex = response.text.indexOf('Banana');
          expect(appleIndex).toBeLessThan(cherryIndex);
          expect(cherryIndex).toBeLessThan(bananaIndex);
        });
    });
      
    describe('Edge Cases', () => {
        test('GET /sort with invalid sortBy redirects to /', async () => {
          const response = await request(app)
            .get('/sort?sortBy=invalid&sortOrder=asc')
            .expect(302);
          expect(response.headers.location).toBe('/');
        });
        test('GET /sort with missing sortBy redirects to /', async () => {
          const response = await request(app)
            .get('/sort?sortOrder=asc')
            .expect(302);
          expect(response.headers.location).toBe('/');
        });
    });
});
  