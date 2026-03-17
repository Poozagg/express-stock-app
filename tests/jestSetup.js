const db = require('../models');
// Runs ONCE before all test files
beforeAll(async () => {
  // db.sequelize.options.logging = false;  // Disable SQL logs
  await db.sequelize.sync({ force: true });
});

// Runs ONCE after all test files
afterAll(async () => {
  await db.sequelize.close();
});