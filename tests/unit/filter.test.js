const db = require('../../models');
const stockController = require('../../controllers/stockController');

describe('Filter Controller - Unit Tests', () => {
  beforeAll(async () => {
    // Create diverse test products for filtering
    await db.Product.create({ id: 'FILT010', name: 'T-Shirt', pricePerItem: 15.00, quantity: 50, type: 'clothing' });
    await db.Product.create({ id: 'FILT011', name: 'Laptop', pricePerItem: 999.99, quantity: 5, type: 'electronic' });
    await db.Product.create({ id: 'FILT012', name: 'Novel', pricePerItem: 12.50, quantity: 30, type: 'book' });
    await db.Product.create({ id: 'FILT013', name: 'Milk', pricePerItem: 2.00, quantity: 3, type: 'grocery' });
    await db.Product.create({ id: 'FILT014', name: 'Teddy Bear', pricePerItem: 25.00, quantity: 8, type: 'toy' });
    await db.Product.create({ id: 'FILT015', name: 'Headphones', pricePerItem: 50.00, quantity: 12, type: 'electronic' });
  });

  afterAll(async () => {
    await db.Product.destroy({ where: { id: ['FILT010', 'FILT011', 'FILT012', 'FILT013', 'FILT014', 'FILT015'] } });
  });

  // Helper to create mock req/res
  const createMocks = (query = {}) => ({
    req: { query },
    res: {
      render: jest.fn(),
      redirect: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    }
  });

  // FILTER BY TYPE - just check one type 
  describe('Filter by Type', () => {
    test('filters products by type "electronic"', async () => {
      const { req, res } = createMocks({ type: 'electronic' });
      await stockController.filter(req, res);

      expect(res.render).toHaveBeenCalled();
      const products = res.render.mock.calls[0][1].products;
      expect(products.length).toBe(2);
      products.forEach(p => expect(p.type).toBe('electronic'));
    });
  });

  // FILTER BY PRICE RANGE
  describe('Filter by Price Range', () => {
    test('filters products with minPrice', async () => {
      const { req, res } = createMocks({ minPrice: '50' });
      await stockController.filter(req, res);

      const products = res.render.mock.calls[0][1].products;
      products.forEach(p => expect(parseFloat(p.pricePerItem)).toBeGreaterThanOrEqual(50));
    });

    test('filters products with maxPrice', async () => {
      const { req, res } = createMocks({ maxPrice: '15' });
      await stockController.filter(req, res);

      const products = res.render.mock.calls[0][1].products;
      expect(products.length).toBeGreaterThanOrEqual(2); // T-Shirt (15), Novel (12.50), Milk (2)
      products.forEach(p => expect(parseFloat(p.pricePerItem)).toBeLessThanOrEqual(15));
    });

    test('filters products within a price range (minPrice and maxPrice)', async () => {
      const { req, res } = createMocks({ minPrice: '10', maxPrice: '30' });
      await stockController.filter(req, res);

      const products = res.render.mock.calls[0][1].products;
      products.forEach(p => {
        expect(parseFloat(p.pricePerItem)).toBeGreaterThanOrEqual(10);
        expect(parseFloat(p.pricePerItem)).toBeLessThanOrEqual(30);
      });
    });

    test('returns empty results for impossible price range', async () => {
      const { req, res } = createMocks({ minPrice: '5000', maxPrice: '6000' });
      await stockController.filter(req, res);

      const products = res.render.mock.calls[0][1].products;
      expect(products.length).toBe(0);
    });
  });

  // FILTER BY LOW STOCK 
  describe('Filter by Low Stock', () => {
    test('filters products with low stock (quantity < 10)', async () => {
      const { req, res } = createMocks({ lowStock: 'true' });
      await stockController.filter(req, res);

      const products = res.render.mock.calls[0][1].products;
      expect(products.length).toBeGreaterThanOrEqual(3); // Laptop (5), Milk (3), Teddy Bear (8)
      products.forEach(p => expect(p.quantity).toBeLessThan(10));
    });
  });

  // COMBINED FILTERS
  describe('Combined Filters', () => {
    test('filters by type and price range', async () => {
      const { req, res } = createMocks({ type: 'electronic', minPrice: '100' });
      await stockController.filter(req, res);

      const products = res.render.mock.calls[0][1].products;
      products.forEach(p => {
        expect(p.type).toBe('electronic');
        expect(parseFloat(p.pricePerItem)).toBeGreaterThanOrEqual(100);
      });
    });

    test('filters by type and low stock', async () => {
      const { req, res } = createMocks({ type: 'electronic', lowStock: 'true' });
      await stockController.filter(req, res);

      const products = res.render.mock.calls[0][1].products;
      expect(products.length).toBe(1); // Laptop (qty: 5)
      expect(products[0].name).toBe('Laptop');
    });

    test('filters by price range and low stock', async () => {
      const { req, res } = createMocks({ maxPrice: '30', lowStock: 'true' });
      await stockController.filter(req, res);

      const products = res.render.mock.calls[0][1].products;
      products.forEach(p => {
        expect(parseFloat(p.pricePerItem)).toBeLessThanOrEqual(30);
        expect(p.quantity).toBeLessThan(10);
      });
    });

    test('filters by type, price range, and low stock combined', async () => {
      const { req, res } = createMocks({ type: 'grocery', maxPrice: '10', lowStock: 'true' });
      await stockController.filter(req, res);

      const products = res.render.mock.calls[0][1].products;
      expect(products.length).toBe(1); // Milk (price: 2, qty: 3)
      expect(products[0].name).toBe('Milk');
    });
  });

  // SORTING FILTERED RESULTS
  describe('Sorting Filtered Results', () => {
    test('sorts filtered results by name ascending', async () => {
      const { req, res } = createMocks({ type: 'electronic', sortBy: 'name', sortOrder: 'asc' });
      await stockController.filter(req, res);

      const products = res.render.mock.calls[0][1].products;
      expect(products.length).toBe(2);
      expect(products[0].name).toBe('Headphones');
      expect(products[1].name).toBe('Laptop');
    });

    test('sorts filtered results by name descending', async () => {
      const { req, res } = createMocks({ type: 'electronic', sortBy: 'name', sortOrder: 'desc' });
      await stockController.filter(req, res);

      const products = res.render.mock.calls[0][1].products;
      expect(products[0].name).toBe('Laptop');
      expect(products[1].name).toBe('Headphones');
    });

    test('sorts filtered results by pricePerItem ascending', async () => {
      const { req, res } = createMocks({ type: 'electronic', sortBy: 'pricePerItem', sortOrder: 'asc' });
      await stockController.filter(req, res);

      const products = res.render.mock.calls[0][1].products;
      expect(parseFloat(products[0].pricePerItem)).toBeLessThanOrEqual(parseFloat(products[1].pricePerItem));
    });

    test('sorts filtered results by quantity descending', async () => {
      const { req, res } = createMocks({ type: 'electronic', sortBy: 'quantity', sortOrder: 'desc' });
      await stockController.filter(req, res);

      const products = res.render.mock.calls[0][1].products;
      // Headphones (12) > Laptop (5)
      expect(products[0].name).toBe('Headphones');
      expect(products[1].name).toBe('Laptop');
    });

    test('invalid sortBy is ignored, results still filtered', async () => {
      const { req, res } = createMocks({ type: 'electronic', sortBy: 'invalid' });
      await stockController.filter(req, res);

      const products = res.render.mock.calls[0][1].products;
      expect(products.length).toBe(2);
      products.forEach(p => expect(p.type).toBe('electronic'));
    });
  });

  // ─── State Preservation ───────────────────────────────────────
  describe('State Preservation', () => {
    test('passes filter values back to the view', async () => {
      const { req, res } = createMocks({ type: 'electronic', minPrice: '10', maxPrice: '100', lowStock: 'true' });
      await stockController.filter(req, res);

      const renderArgs = res.render.mock.calls[0][1];
      expect(renderArgs.type).toBe('electronic');
      expect(renderArgs.minPrice).toBe('10');
      expect(renderArgs.maxPrice).toBe('100');
      expect(renderArgs.lowStock).toBe('true');
    });

    test('passes sort values back to the view', async () => {
      const { req, res } = createMocks({ type: 'electronic', sortBy: 'name', sortOrder: 'asc' });
      await stockController.filter(req, res);

      const renderArgs = res.render.mock.calls[0][1];
      expect(renderArgs.sortBy).toBe('name');
      expect(renderArgs.sortOrder).toBe('asc');
    });
  });

  describe('Edge Cases', () => {
    test('redirects to / when no filter params are provided', async () => {
      const { req, res } = createMocks({});
      await stockController.filter(req, res);

      expect(res.redirect).toHaveBeenCalledWith('/');
      expect(res.render).not.toHaveBeenCalled();
    });

    test('redirects to / when all filter params are empty', async () => {
      const { req, res } = createMocks({ type: '', minPrice: '', maxPrice: '', lowStock: '' });
      await stockController.filter(req, res);

      expect(res.redirect).toHaveBeenCalledWith('/');
    });

    test('invalid type is ignored but other filters still apply', async () => {
      const { req, res } = createMocks({ type: 'invalidType', maxPrice: '20' });
      await stockController.filter(req, res);

      // Should still filter by price (type is ignored since invalid)
      const products = res.render.mock.calls[0][1].products;
      products.forEach(p => expect(parseFloat(p.pricePerItem)).toBeLessThanOrEqual(20));
    });

    test('renders index view template', async () => {
      const { req, res } = createMocks({ type: 'clothing' });
      await stockController.filter(req, res);

      expect(res.render).toHaveBeenCalledWith('index', expect.any(Object));
    });
  });
});
