const db = require('../models');
const { Product, Clothing, Electronic, Toy, Book, Grocery } = db;

async function prebuildDatabase() {
  try {
    // Sync the database and create tables
    await db.sequelize.sync({ force: true });

    console.log('Database synced. Creating sample data...');

    // Create sample products
    const products = await Product.bulkCreate([
      { id: 'CLO001', name: 'T-Shirt', pricePerItem: 19.99, quantity: 100, type: 'clothing' },
      { id: 'CLO002', name: 'Jeans', pricePerItem: 49.99, quantity: 50, type: 'clothing' },
      { id: 'CLO003', name: 'Shirt', pricePerItem: 15.00, quantity: 0, type: 'clothing' },
      { id: 'CLO004', name: 'Dress', pricePerItem: 49.99, quantity: 2, type: 'clothing' },
      { id: 'ELE001', name: 'Smartphone', pricePerItem: 599.99, quantity: 30, type: 'electronic' },
      { id: 'ELE002', name: 'Laptop', pricePerItem: 999.99, quantity: 20, type: 'electronic' },
      { id: 'TOY001', name: 'Action Figure', pricePerItem: 14.99, quantity: 200, type: 'toy' },
      { id: 'TOY002', name: 'Board Game', pricePerItem: 29.99, quantity: 150, type: 'toy' },
      { id: 'BOOK001', name: 'Novel', pricePerItem: 9.99, quantity: 300, type: 'book' },
      { id: 'BOOK002', name: 'Biography', pricePerItem: 14.99, quantity: 250, type: 'book' },
      { id: 'GROC001', name: 'Organic Apples', pricePerItem: 3.99, quantity: 500, type: 'grocery' },
      { id: 'GROC002', name: 'Milk', pricePerItem: 1.49, quantity: 400, type: 'grocery' },
      { id: 'GROC003', name: 'Bread', pricePerItem: 2.49, quantity: 1, type: 'grocery' },
    ]);

    // Create sample clothing items
    await Clothing.bulkCreate([
      { ProductId: 'CLO001', size: 'M', material: 'Cotton', color: 'White', brand: 'FashionCo', gender: 'Unisex' },
      { ProductId: 'CLO002', size: '32', material: 'Denim', color: 'Blue', brand: 'DenimWear', gender: 'Unisex' },
    ]);

    // Create sample electronics items
    await Electronic.bulkCreate([
      { ProductId: 'ELE001', brand: 'TechGiant', warranty: '1 year', model: 'X2000', powerConsumption: 5, dimensions: '150x75x8mm' },
      { ProductId: 'ELE002', brand: 'LaptopPro', warranty: '2 years', model: 'UltraBook', powerConsumption: 45, dimensions: '350x240x18mm' },
    ]);

    //Create sample toys items
    await Toy.bulkCreate([
      { ProductId: 'TOY001', ageGroup: '3-5 years', batteryOperated: false, material: 'Plastic' },
      { ProductId: 'TOY002', ageGroup: '6-8 years', batteryOperated: true, material: 'Wood' },
    ]);

    //Create sample books items
    await Book.bulkCreate([
      { ProductId: 'BOOK001', author: 'John Doe', isbn: '1234567890', genre: 'Fiction', publicationDate: '2020-01-01' },
      { ProductId: 'BOOK002', author: 'Jane Smith', isbn: '0987654321', genre: 'Non-Fiction', publicationDate: '2019-05-15' },
    ]);
    
     //Create sample groceries items
     await Grocery.bulkCreate([
      { ProductId: 'GROC001', expirationDate: '2024-12-31', nutritionalInfo: 'Calories: 200, Fat: 10g, Carbs: 20g, Protein: 5g', organic: true },
      { ProductId: 'GROC002', expirationDate: '2024-11-30', nutritionalInfo: 'Calories: 150, Fat: 5g, Carbs: 15g, Protein: 3g', organic: false },
    ]);

    console.log('Sample data created successfully.');
  } catch (error) {
    console.error('Error creating sample data:', error);
  } finally {
    await db.sequelize.close();
  }
}

prebuildDatabase();

