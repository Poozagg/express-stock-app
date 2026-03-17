const db = require('../models');
// Runs ONCE before all test files
beforeAll(async () => {
  // db.sequelize.options.logging = false;  // Disable SQL logs
  await db.sequelize.sync({ force: true });
});

afterAll(async () => {
  // Delete children first (they have foreign keys to Product)
  await db.Clothing.destroy({ where: {} });
  await db.Electronic.destroy({ where: {} });
  await db.Toy.destroy({ where: {} });
  await db.Book.destroy({ where: {} });
  await db.Grocery.destroy({ where: {} });
  // Delete parent last
  await db.Product.destroy({ where: {} });
});

// Runs ONCE after all test files
afterAll(async () => {
  await db.sequelize.close();
});