const db = require('../models');
const Product = db.Product;
const Clothing = db.Clothing;
const Electronic = db.Electronic;
const { Op } = require('sequelize');
const axios = require('axios');

exports.index = async (req, res) => {
  try {
    // Fetch all products from the database
    // The `include` option performs an INNER JOIN with the Clothing and Electronic tables
    const products = await Product.findAll({
      include: [
        { model: Clothing, required: false },
        { model: Electronic, required: false }
      ]
    });
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
    const { id, name, price, quantity, type, size, material, brand, warranty } = req.body;

    // Create a new product in the database
    const product = await Product.create({
      id, name, price, quantity, type
    });

    // Based on the product type, create associated Clothing or Electronic record
    if (type === 'clothing') {
      await Clothing.create({ ProductId: product.id, size, material });
    } else if (type === 'electronic') {
      await Electronic.create({ ProductId: product.id, brand, warranty });
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
    const product = await Product.findByPk(id, {
      include: [
        { model: Clothing, required: false },
        { model: Electronic, required: false }
      ]
    });
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
    const { name, price, quantity, type, size, material, brand, warranty } = req.body;

    // Find the product by id
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).send("Product not found.");
    }

    // Update the product details
    await product.update({ name, price, quantity, type });

    // Update associated records based on product type
    if (type === 'clothing') {
      let clothing = await Clothing.findOne({ where: { ProductId: id } });
      if (clothing) {
        await clothing.update({ size, material });
      } else {
        await Clothing.create({ ProductId: id, size, material });
      }
    } else if (type === 'electronic') {
      let electronic = await Electronic.findOne({ where: { ProductId: id } });
      if (electronic) {
        await electronic.update({ brand, warranty });
      } else {
        await Electronic.create({ ProductId: id, brand, warranty });
      }
    }

    res.redirect(`/details/${id}`);
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

    // Delete associated records based on product type
    if (product.type === 'clothing') {
      await Clothing.destroy({ where: { ProductId: id } });
    } else if (product.type === 'electronic') {
      await Electronic.destroy({ where: { ProductId: id } });
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
    const product = await Product.findByPk(id, {
      include: [
        { model: Clothing, required: false },
        { model: Electronic, required: false }
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
        { model: Electronic, required: false }
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
        { model: Electronic, required: false }
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
        { model: Electronic, required: false }
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

