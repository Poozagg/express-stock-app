const request = require('supertest');
const app = require('../../app');
const db = require('../../models');

describe('Filter Controller - Integration Tests', () => {
  beforeAll(async () => {
    // Create diverse test products for filtering
    await db.Product.create({ id: 'FILT001', name: 'T-Shirt', pricePerItem: 15.00, quantity: 50, type: 'clothing' });
    await db.Product.create({ id: 'FILT002', name: 'Laptop', pricePerItem: 999.99, quantity: 5, type: 'electronic' });
    await db.Product.create({ id: 'FILT003', name: 'Novel', pricePerItem: 12.50, quantity: 30, type: 'book' });
    await db.Product.create({ id: 'FILT004', name: 'Milk', pricePerItem: 2.00, quantity: 3, type: 'grocery' });
    await db.Product.create({ id: 'FILT005', name: 'Teddy Bear', pricePerItem: 25.00, quantity: 8, type: 'toy' });
    await db.Product.create({ id: 'FILT006', name: 'Headphones', pricePerItem: 50.00, quantity: 12, type: 'electronic' });
  });

  afterAll(async () => {
    await db.Product.destroy({ where: { id: ['FILT001', 'FILT002', 'FILT003', 'FILT004', 'FILT005', 'FILT006'] } });
  });

  // FILTER BY TYPE 
  describe('Filter by Type', () => {
    test('GET /filter?type=electronic returns only electronic products', async () => {
      const response = await request(app)
        .get('/filter?type=electronic')
        .expect(200);

      expect(response.text).toContain('Laptop');
      expect(response.text).toContain('Headphones');
      expect(response.text).not.toContain('T-Shirt');
      expect(response.text).not.toContain('Novel');
    });

    test('GET /filter?type=clothing returns only clothing products', async () => {
      const response = await request(app)
        .get('/filter?type=clothing')
        .expect(200);

      expect(response.text).toContain('T-Shirt');
      expect(response.text).not.toContain('Laptop');
    });

    test('GET /filter?type=grocery returns only grocery products', async () => {
      const response = await request(app)
        .get('/filter?type=grocery')
        .expect(200);

      expect(response.text).toContain('Milk');
      expect(response.text).not.toContain('Novel');
    });

    test('GET /filter?type=book returns only book products', async () => {
      const response = await request(app)
        .get('/filter?type=book')
        .expect(200);

      expect(response.text).toContain('Novel');
      expect(response.text).not.toContain('Laptop');
    });

    test('GET /filter?type=toy returns only toy products', async () => {
      const response = await request(app)
        .get('/filter?type=toy')
        .expect(200);

      expect(response.text).toContain('Teddy Bear');
      expect(response.text).not.toContain('Milk');
    });
  });

  // FILTER BY PRICE RANGE
  describe('Filter by Price Range', () => {
    test('GET /filter?minPrice=50 returns products priced >= 50', async () => {
      const response = await request(app)
        .get('/filter?minPrice=50')
        .expect(200);

      expect(response.text).toContain('Laptop');
      expect(response.text).toContain('Headphones');
      expect(response.text).not.toContain('Milk');
      expect(response.text).not.toContain('Novel');
    });

    test('GET /filter?maxPrice=15 returns products priced <= 15', async () => {
      const response = await request(app)
        .get('/filter?maxPrice=15')
        .expect(200);

      expect(response.text).toContain('T-Shirt');
      expect(response.text).toContain('Novel');
      expect(response.text).toContain('Milk');
      expect(response.text).not.toContain('Laptop');
    });

    test('GET /filter?minPrice=10&maxPrice=30 returns products in price range', async () => {
      const response = await request(app)
        .get('/filter?minPrice=10&maxPrice=30')
        .expect(200);

      expect(response.text).toContain('T-Shirt');   // 15.00
      expect(response.text).toContain('Novel');       // 12.50
      expect(response.text).toContain('Teddy Bear');  // 25.00
      expect(response.text).not.toContain('Milk');     // 2.00
      expect(response.text).not.toContain('Laptop');   // 999.99
    });
  });

  // FILTER BY LOW STOCK
  describe('Filter by Low Stock', () => {
    test('GET /filter?lowStock=true returns products with quantity < 10', async () => {
      const response = await request(app)
        .get('/filter?lowStock=true')
        .expect(200);

      expect(response.text).toContain('Laptop');      // qty: 5
      expect(response.text).toContain('Milk');         // qty: 3
      expect(response.text).toContain('Teddy Bear');   // qty: 8
      expect(response.text).not.toContain('T-Shirt');  // qty: 50
    });
  });

  // COMBINED FILTERS
  describe('Combined Filters', () => {
    test('GET /filter?type=electronic&minPrice=100 filters by type and min price', async () => {
      const response = await request(app)
        .get('/filter?type=electronic&minPrice=100')
        .expect(200);

      expect(response.text).toContain('Laptop');         // electronic, 999.99
      expect(response.text).not.toContain('Headphones');  // electronic, 50 (below min)
    });

    test('GET /filter?type=electronic&lowStock=true filters by type and low stock', async () => {
      const response = await request(app)
        .get('/filter?type=electronic&lowStock=true')
        .expect(200);

      expect(response.text).toContain('Laptop');          // electronic, qty: 5
      expect(response.text).not.toContain('Headphones');   // electronic, qty: 12 (not low)
    });

    test('GET /filter?type=grocery&maxPrice=10&lowStock=true filters by all params', async () => {
      const response = await request(app)
        .get('/filter?type=grocery&maxPrice=10&lowStock=true')
        .expect(200);

      expect(response.text).toContain('Milk'); // grocery, price: 2, qty: 3
    });
  });

  // SORTING FILTERED RESULTS
  describe('Sorting Filtered Results', () => {
    test('GET /filter?type=electronic&sortBy=name&sortOrder=asc sorts filtered results A-Z', async () => {
      const response = await request(app)
        .get('/filter?type=electronic&sortBy=name&sortOrder=asc')
        .expect(200);

      // Headphones should appear before Laptop
      const headphonesIndex = response.text.indexOf('Headphones');
      const laptopIndex = response.text.indexOf('Laptop');
      expect(headphonesIndex).toBeLessThan(laptopIndex);
    });

    test('GET /filter?type=electronic&sortBy=name&sortOrder=desc sorts filtered results Z-A', async () => {
      const response = await request(app)
        .get('/filter?type=electronic&sortBy=name&sortOrder=desc')
        .expect(200);

      // Laptop should appear before Headphones
      const laptopIndex = response.text.indexOf('Laptop');
      const headphonesIndex = response.text.indexOf('Headphones');
      expect(laptopIndex).toBeLessThan(headphonesIndex);
    });

    test('GET /filter?type=electronic&sortBy=pricePerItem&sortOrder=asc sorts by price low to high', async () => {
      const response = await request(app)
        .get('/filter?type=electronic&sortBy=pricePerItem&sortOrder=asc')
        .expect(200);

      // Headphones (50) should appear before Laptop (999.99)
      const headphonesIndex = response.text.indexOf('Headphones');
      const laptopIndex = response.text.indexOf('Laptop');
      expect(headphonesIndex).toBeLessThan(laptopIndex);
    });

    test('GET /filter?type=electronic&sortBy=quantity&sortOrder=desc sorts by quantity high to low', async () => {
      const response = await request(app)
        .get('/filter?type=electronic&sortBy=quantity&sortOrder=desc')
        .expect(200);

      // Headphones (12) should appear before Laptop (5)
      const headphonesIndex = response.text.indexOf('Headphones');
      const laptopIndex = response.text.indexOf('Laptop');
      expect(headphonesIndex).toBeLessThan(laptopIndex);
    });
  });

  describe('Edge Cases', () => {
    test('GET /filter with no params redirects to /', async () => {
      const response = await request(app)
        .get('/filter')
        .expect(302);

      expect(response.headers.location).toBe('/');
    });

    test('GET /filter with invalid type still applies other filters', async () => {
      const response = await request(app)
        .get('/filter?type=invalidType&maxPrice=20')
        .expect(200);

      // Should still filter by price, ignoring invalid type
      expect(response.text).toContain('T-Shirt');  // 15.00
      expect(response.text).toContain('Novel');     // 12.50
      expect(response.text).toContain('Milk');      // 2.00
      expect(response.text).not.toContain('Laptop'); // 999.99
    });

    test('GET /filter with impossible price range returns empty results', async () => {
      const response = await request(app)
        .get('/filter?minPrice=5000&maxPrice=6000')
        .expect(200);

      // None of our test products are in this range
      expect(response.text).not.toContain('Laptop');
      expect(response.text).not.toContain('T-Shirt');
    });

    test('GET /filter renders the Clear Filters button', async () => {
      const response = await request(app)
        .get('/filter?type=electronic')
        .expect(200);

      expect(response.text).toContain('Clear Filters');
    });

    test('GET /filter sortable column headers preserve filter params', async () => {
      const response = await request(app)
        .get('/filter?type=electronic')
        .expect(200);

      // Column headers should link to /filter with filter params preserved
      expect(response.text).toContain('/filter?type=electronic&amp;sortBy=name&amp;sortOrder=asc');
      expect(response.text).toContain('/filter?type=electronic&amp;sortBy=pricePerItem&amp;sortOrder=asc');
    });
  });
});
