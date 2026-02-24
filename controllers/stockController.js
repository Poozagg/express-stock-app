const db = require("../models");
const Product = db.Product;

exports.index = async (req, res) => {
  try {
    const products = await Product.findAll(); // database call to fetch all products
    res.render("index", { products: products });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching products.");
  }
};

exports.getDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);

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
        name: { [Op.like]: `%${query}%` },
      },
    });
    res.render("index", { products, searchQuery: query });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error searching products.");
  }
};

exports.sort = async (req, res) => {
  try {
    // Fetch all products and sort them by name in ascending order
    const products = await Product.findAll({
      order: [["name", "ASC"]],
    });
    res.render("index", { products, sortBy: "name" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error sorting products.");
  }
};

exports.create = async (req, res) => {
  try {
    // Destructure the request body to get product details
    console.log(req.body);
    const { id, name, price, quantity, type } = req.body;

    // Create a new product in the database
    const product = await Product.create({
      id, name, price, quantity, type
    });   

    // Redirect to the home page after successful creation
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating product.");
  }
};