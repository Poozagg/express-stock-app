const db = require('../../models');
const stockController = require('../../controllers/stockController');

describe('Stock Controller', () => {
  describe('Unit Tests', () => {
    beforeAll(async () => {
      await db.Product.create({
        id: 'TEST002',
        name: 'Product to Delete',
        pricePerItem: 5.99,
        quantity: 20,
        type: 'electronic'
      });

    });

    afterAll(async () => {
      // Clean up the database after tests
      await db.Product.destroy({ where: { id: 'TEST002' } });
    });
    test('Delete a product', async() => {
      // to delete a product, we first need to create it in the database
      // directly calls the Sequelize model to create a product without going through the controller
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
  });
});


