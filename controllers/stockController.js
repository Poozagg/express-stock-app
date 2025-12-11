const db = require('../models');
const Product = db.Product;
const Clothing = db.Clothing;
const Electronics = db.Electronics;
const { Op } = require('sequelize');
const axios = require('axios');

exports.index = async (req, res) => {
  try {
    // Fetch all products from the database
    // The `include` option performs an INNER JOIN with the Clothing and Electronics tables
    const products = await Product.findAll({
      include: [
        { model: Clothing, required: false },
        { model: Electronics, required: false }
      ]
    });
    // Render the index view with the fetched products
    res.render('index', { products: products });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching products.");
  }
};

exports.create = async (req, res) => {
  try {
    // Destructure the request body to get product details
    const { id, name, price, quantity, type, size, material, brand, warranty } = req.body;

    // Create a new product in the database
    const product = await Product.create({
      id, name, price, quantity, type
    });

    // Based on the product type, create associated Clothing or Electronics record
    if (type === 'clothing') {
      await Clothing.create({ ProductId: product.id, size, material });
    } else if (type === 'electronics') {
      await Electronics.create({ ProductId: product.id, brand, warranty });
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

exports.update = async (req, res) => {
  // TODO: Implement update functionality
};

exports.delete = async (req, res) => {
  // TODO: Implement delete functionality
};

exports.getDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id, {
      include: [
        { model: Clothing, required: false },
        { model: Electronics, required: false }
      ]
    });

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
      include: [
        { model: Clothing, required: false },
        { model: Electronics, required: false }
      ]
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
      include: [
        { model: Clothing, required: false },
        { model: Electronics, required: false }
      ],
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
  const targetCurrency = req.query.currency || 'USD'; // Updated to use query parameter or default to USD

  try {
    const product = await Product.findByPk(id, {
      include: [
        { model: Clothing, required: false },
        { model: Electronics, required: false }
      ]
    });

    if (!product) {
      return res.status(404).send("Product not found.");
    }

    const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/GBP`);

    const exchangeRate = response.data.rates[targetCurrency];
    
    const convertedPrice = targetCurrency === 'GBP' 
     ? product.price 
     : (product.price * exchangeRate).toFixed(2);

    res.render('details', { 
      product: product, 
      convertedPrice: convertedPrice, 
      targetCurrency: targetCurrency,
      originalCurrency: 'GBP'
    });

  } catch (error) {
    console.error('Error fetching exchange rates or product:', error);
    res.status(500).send("Error converting currency.");
  }
};

