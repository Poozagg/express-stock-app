const db = require('../../models');
const stockController = require('../../controllers/stockController');
describe('Sort Controller - Unit Tests', () => {
  beforeAll(async () => {
    await db.Product.create({ id: 'SORT010', name: 'Apple', pricePerItem: 30.00, quantity: 10, type: 'grocery' });
    await db.Product.create({ id: 'SORT011', name: 'Banana', pricePerItem: 10.00, quantity: 20, type: 'grocery' });
    await db.Product.create({ id: 'SORT012', name: 'Cherry', pricePerItem: 20.00, quantity: 15, type: 'grocery' });
  });

  afterAll(async () => {
    await db.Product.destroy({ where: { id: ['SORT010', 'SORT011', 'SORT012'] } });
  });
  
  describe('Sort by Name', () => {
    test('sorts products by name in ascending order', async () => {
      const mockReq = { query: { sortBy: 'name', sortOrder: 'asc' } };
      const mockRes = {
        render: jest.fn(),
        redirect: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      };

      await stockController.sort(mockReq, mockRes);

      // Verify order: Apple, Banana, Cherry
      const products = mockRes.render.mock.calls[0][1].products;
      expect(products[0].name).toBe('Apple');
      expect(products[1].name).toBe('Banana');
      expect(products[2].name).toBe('Cherry');
  });

    test('sorts products by name in descending order', async () => {
      const mockReq = { query: { sortBy: 'name', sortOrder: 'desc' } };
      const mockRes = {
        render: jest.fn(),
        redirect: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      };

      await stockController.sort(mockReq, mockRes);

      // Verify order: Cherry, Banana, Apple
      const products = mockRes.render.mock.calls[0][1].products;
      expect(products[0].name).toBe('Cherry');
      expect(products[1].name).toBe('Banana');
      expect(products[2].name).toBe('Apple');
    });
  });

  describe('Sort by Price', () => {
    test('sorts products by pricePerItem in ascending order', async () => {
      const mockReq = { query: { sortBy: 'pricePerItem', sortOrder: 'asc' } };
      const mockRes = {
        render: jest.fn(),
        redirect: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      };
      
      await stockController.sort(mockReq, mockRes);
      
      // Verify order: Banana (10), Cherry (20), Apple (30)
      const products = mockRes.render.mock.calls[0][1].products;
      expect(products[0].name).toBe('Banana');
      expect(products[1].name).toBe('Cherry');
      expect(products[2].name).toBe('Apple');
    });
    
    test('sorts products by pricePerItem in descending order', async () => {
      const mockReq = { query: { sortBy: 'pricePerItem', sortOrder: 'desc' } };
      const mockRes = {
        render: jest.fn(),
        redirect: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      };
      
      await stockController.sort(mockReq, mockRes);
      
      // Verify order: Apple (30), Cherry (20), Banana (10)
      const products = mockRes.render.mock.calls[0][1].products;
      expect(products[0].name).toBe('Apple');
      expect(products[1].name).toBe('Cherry');
      expect(products[2].name).toBe('Banana');
    });
  });
  
  describe('Edge Cases', () => {
    test('invalid sortBy redirects to /', async () => {
      const mockReq = { query: { sortBy: 'invalid', sortOrder: 'asc' } };
      const mockRes = {
        render: jest.fn(),
        redirect: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      };
      
      await stockController.sort(mockReq, mockRes);
      
      expect(mockRes.redirect).toHaveBeenCalledWith('/');
      expect(mockRes.render).not.toHaveBeenCalled();
    });
    
    test('missing sortBy redirects to /', async () => {
      const mockReq = { query: { sortOrder: 'asc' } };
      const mockRes = {
        render: jest.fn(),
        redirect: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      };
      
      await stockController.sort(mockReq, mockRes);
      
      expect(mockRes.redirect).toHaveBeenCalledWith('/');
    });
    
    test('invalid sortOrder defaults to ASC', async () => {
      const mockReq = { query: { sortBy: 'name', sortOrder: 'invalid' } };
      const mockRes = {
        render: jest.fn(),
        redirect: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      };
      
      await stockController.sort(mockReq, mockRes);
      
      // Should still render with ASC order: Apple, Banana, Cherry
      const products = mockRes.render.mock.calls[0][1].products;
      expect(products[0].name).toBe('Apple');
      expect(products[1].name).toBe('Banana');
      expect(products[2].name).toBe('Cherry');
    });
  });
});