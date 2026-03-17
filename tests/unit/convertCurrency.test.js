const db = require('../../models');
const stockController = require('../../controllers/stockController');
const axios = require('axios');

jest.mock('axios'); // Mock axios to control API responses in tests

describe('Stock Controller', () => {
  describe('Unit Tests', () => {
    beforeAll(async () => {
      // Create test product in db
      await db.Product.create({
        id: 'TEST006',
        name: 'Currency Test Product',
        pricePerItem: 10.00,
        quantity: 5,
        type: 'electronic'
      });
    });

    test('Convert product price to USD', async () => {
      // Mock axios response
      axios.get.mockResolvedValue({
        data: {
          rates: { USD: 1.25 }
        }
      });

      // Mocking the request and response objects
      // This allows us to test the controller function in isolation
      const mockReq = {
        params: { id: 'TEST006' },
        query: { currency: 'USD' }
      };
      const mockRes = {
        render: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      };

      // Call the controller method directly
      await stockController.convertCurrency(mockReq, mockRes);
      // Verify render was called with correct arguments
      expect(mockRes.render).toHaveBeenCalledWith('details',
        expect.objectContaining({
          targetCurrency: 'USD',
          originalCurrency: 'GBP',
          convertedPricePerItem: '12.50'
        })
      );
    });
  });
});