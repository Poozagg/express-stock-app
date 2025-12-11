const db = require('../models');
const { Product, Clothing, Electronics } = db;

async function prebuildDatabase() {
  try {
    // Sync the database and create tables
    await db.sequelize.sync({ force: true });

    console.log('Database synced. Creating sample data...');

    // Create sample products
    const products = await Product.bulkCreate([
      { id: 'CLO001', name: 'T-Shirt', price: 19.99, quantity: 100, type: 'clothing' },
      { id: 'CLO002', name: 'Jeans', price: 49.99, quantity: 50, type: 'clothing' },
      { id: 'ELE001', name: 'Smartphone', price: 599.99, quantity: 30, type: 'electronics' },
      { id: 'ELE002', name: 'Laptop', price: 999.99, quantity: 20, type: 'electronics' },
    ]);

    // Create sample clothing items
    await Clothing.bulkCreate([
      { ProductId: 'CLO001', size: 'M', material: 'Cotton', color: 'White', brand: 'FashionCo', gender: 'Unisex' },
      { ProductId: 'CLO002', size: '32', material: 'Denim', color: 'Blue', brand: 'DenimWear', gender: 'Unisex' },
    ]);

    // Create sample electronics items
    await Electronics.bulkCreate([
      { ProductId: 'ELE001', brand: 'TechGiant', warranty: '1 year', model: 'X2000', powerConsumption: 5, dimensions: '150x75x8mm' },
      { ProductId: 'ELE002', brand: 'LaptopPro', warranty: '2 years', model: 'UltraBook', powerConsumption: 45, dimensions: '350x240x18mm' },
    ]);

    console.log('Sample data created successfully.');
  } catch (error) {
    console.error('Error creating sample data:', error);
  } finally {
    await db.sequelize.close();
  }
}

prebuildDatabase();

