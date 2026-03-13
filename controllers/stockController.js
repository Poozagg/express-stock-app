const db = require('../models');
const Product = db.Product;
const Clothing = db.Clothing;
const Electronic = db.Electronic;
const Toy = db.Toy;
const Book = db.Book;
const Grocery = db.Grocery;
const { Op } = require('sequelize');
const axios = require('axios');
const clothing = require('../models/clothing');

//Reusable include array for fetching all product types in one query
const allProductIncludes = [
  { model: Clothing, required: false },
  { model: Electronic, required: false },
  { model: Toy, required: false },
  { model: Book, required: false },
  { model: Grocery, required: false }
];

//dynamic lookup: model reference + field names for each type
// O(n) - stores only model references in memory, not functions or other data
const typeModelMap = {
  clothing: { 
    model: Clothing, 
    fields: ['size', 'material', 'color', 'brand', 'gender'] 
  },
  electronic: { 
    model: Electronic, 
    fields: ['brand', 'warranty', 'model', 'powerConsumption', 'dimensions'] 
  },
  toy: { 
    model: Toy, 
    fields: ['ageGroup', 'material', 'batteryOperated'] 
  },
  book: { 
    model: Book, 
    fields: ['author', 'isbn', 'genre', 'publicationDate'] 
  },
  grocery: { 
    model: Grocery, 
    fields: ['expirationDate', 'nutritionalInfo', 'organic'] 
  }
};

exports.index = async (req, res) => {
  try {
    // Fetch all products from the database
    // The `include` option performs an INNER JOIN with all product tables
    const products = await Product.findAll({include: allProductIncludes});
    // Render the index view with the fetched products
    res.render('index', { products: products });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching products.");
  }
};

exports.createPage = (req, res) => {
  // Render the add product form
  res.render('createPage');
};

exports.create = async (req, res) => {
  try {
    // Destructure the request body to get product details
    const { id, name, pricePerItem, quantity, type } = req.body;

    // Create a new product in the database
    const product = await Product.create({
      id, name, pricePerItem, quantity, type
    });

    // Dynamic lookup for type-specific record creation
    const typeInfo = typeModelMap[type];

    // If type exists in Map, create the type-specific record
    if (typeInfo) {
      const data = {ProductId: product.id};
      typeInfo.fields.forEach(field => data[field] = req.body[field]);
      await typeInfo.model.create(data);
    } else {
      return res.status(400).send("Invalid product type.");
    }

    // Redirect to the home page after successful creation
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating product.");
  }
};

exports.updatePage = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id, {include: allProductIncludes});
    if (!product) {
      return res.status(404).send("Product not found.");
    }
    res.render('updateProductDetails', { product });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching product.");
  }
};

exports.update = async (req, res) => {
  // TODO: Implement update functionality
  try{
    const { id } = req.params;
    const { name, pricePerItem, quantity, type, size, material, brand, warranty } = req.body;

    // Find the product by id
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).send("Product not found.");
    }

    // Update the product details
    await product.update({ name, pricePerItem, quantity, type });

    // Dynamic lookup for type-specific record update/creation
    const typeInfo = typeModelMap[type];

    // look up O(1) - get model reference from map, then find and update/create record
    const {model, fields} = typeModelMap[type];
    if (typeInfo) {
      const data = {};
      typeInfo.fields.forEach(field => data[field] = req.body[field]);

      let record = await model.findOne({ where: { ProductId: id } });
      if (record) {
        await record.update(data);
      } else { 
        await Model.create({ ProductId: id, ...body });
      }
    }

    res.redirect('/details/' + id);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating product.");
  }
};

exports.delete = async (req, res) => {
  // TODO: Implement delete functionality
  try{
    const { id } = req.params;

    // Find the product by id
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).send("Product not found.");
    }

    // Dynamic lookup for type-specific record deletion
    const typeInfo = typeModelMap[product.type];
    if (typeInfo) {
      await typeInfo.model.destroy({ where: { ProductId: id } });
    }

    // Delete the product itself
    await Product.destroy({ where: { id } });

    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting product.");
  }
};

exports.getDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id, { include: allProductIncludes });

    if (!product) {
      return res.status(404).send("Product not found.");
    }

    res.render('details', { product: product });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching product details.");
  }
};

exports.search = async (req, res) => {
  try {
    const { query } = req.query;
    // Search for products where the name matches the query
    // The `Op.like` operator is used for pattern matching
    const products = await Product.findAll({
      where: {
        name: { [Op.like]: `%${query}%` }
      },
      include: allProductIncludes
    });
    res.render('index', { products, searchQuery: query });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error searching products.");
  }
};

exports.sort = async (req, res) => {
  try {
    // Fetch all products and sort them by name in ascending order
    const products = await Product.findAll({
      include: allProductIncludes,
      order: [['name', 'ASC']]
    });
    res.render('index', { products, sortBy: 'name' });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error sorting products.");
  }
};

exports.convertCurrency = async (req, res) => {
  const { id } = req.params; 
  // Updated to use query parameter or default to USD
  const targetCurrency = req.query.currency; 

  // 1) Defining supported currencies and their names for display purposes
  const Currencies = new Map([
    ['USD', 'US Dollar'],
    ['EUR', 'Euro'],
    ['AUD', 'Australian Dollar'],
    ['CAD', 'Canadian Dollar'],
    ['JPY', 'Japanese Yen']
  ]);

  // 2) Validate the target currency against the supported currencies
  if (!Currencies.has(targetCurrency)) {
    return res.status(400).send("Invalid or Unsupported Currency.");
  }

  try {
    const product = await Product.findByPk(id, {
      include: allProductIncludes
    });

    if (!product) {
      return res.status(404).send("Product not found.");
    }

    const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/GBP`);

    const exchangeRate = response.data.rates[targetCurrency];
    
    const convertedPricePerItem = targetCurrency === 'GBP' 
     ? product.pricePerItem 
     : (product.pricePerItem * exchangeRate).toFixed(2);

    res.render('details', { 
      product: product, 
      convertedPricePerItem: convertedPricePerItem, 
      targetCurrency: targetCurrency,
      originalCurrency: 'GBP'
    });

  } catch (error) {
    console.error('Error fetching exchange rates or product:', error);
    res.status(500).send("Error converting currency.");
  }
};

