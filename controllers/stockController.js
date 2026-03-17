const db = require('../models');
const Product = db.Product;
const Clothing = db.Clothing;
const Electronic = db.Electronic;
const Toy = db.Toy;
const Book = db.Book;
const Grocery = db.Grocery;
const { Op } = require('sequelize');
const axios = require('axios');

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
        await model.create({ ProductId: id, ...data });
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
     // 1. Read query params from URL
     const { sortBy, sortOrder } = req.query;
    
     // 2. Validate sortBy
     const validSortFields = ['name', 'pricePerItem', 'quantity', 'type'];
     if (!sortBy || !validSortFields.includes(sortBy)) {
       return res.redirect('/');
     }
     
     // 3. Validate sortOrder (default to ASC if invalid)
     const validOrders = ['asc', 'desc'];
     const safeOrder = validOrders.includes(sortOrder?.toLowerCase()) 
       ? sortOrder.toUpperCase() 
       : 'ASC';
     
     // 4. Dynamic single-column sort based on user selection
     const products = await Product.findAll({
       include: allProductIncludes,
       order: [[sortBy, safeOrder]]  // Single column, user-selected
     });
     
     // 5. Pass both values to view for dropdown state
     res.render('index', { 
       products, 
       sortBy, 
       sortOrder: sortOrder?.toLowerCase() 
     });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error sorting products.");
  }
};

exports.filter = async (req, res) => {
  try {
    const { type, minPrice, maxPrice, lowStock, sortBy, sortOrder } = req.query;

    // If no filter params provided at all, redirect to home
    if (!type && !minPrice && !maxPrice && !lowStock) {
      return res.redirect('/');
    }

    // Build dynamic where clause based on provided filters
    const where = {};

    // Type filter - validate against supported types
    const validTypes = Object.keys(typeModelMap);
    if (type && validTypes.includes(type)) {
      where.type = type;
    }

    // Price range filter using Sequelize operators
    if (minPrice || maxPrice) {
      where.pricePerItem = {};
      if (minPrice) {
        where.pricePerItem[Op.gte] = parseFloat(minPrice);
      }
      if (maxPrice) {
        where.pricePerItem[Op.lte] = parseFloat(maxPrice);
      }
    }

    // Low stock filter (quantity < 10)
    if (lowStock === 'true') {
      where.quantity = { [Op.lt]: 10 };
    }

    // Build query options
    const queryOptions = {
      where,
      include: allProductIncludes
    };

    // Apply sorting if provided
    const validSortFields = ['name', 'pricePerItem', 'quantity', 'type'];
    if (sortBy && validSortFields.includes(sortBy)) {
      const validOrders = ['asc', 'desc'];
      const safeOrder = validOrders.includes(sortOrder?.toLowerCase())
        ? sortOrder.toUpperCase()
        : 'ASC';
      queryOptions.order = [[sortBy, safeOrder]];
    }

    // Fetch filtered (and optionally sorted) products
    const products = await Product.findAll(queryOptions);

    // Pass filter and sort values back to the view for state preservation
    res.render('index', { 
      products, type, minPrice, maxPrice, lowStock,
      sortBy,
      sortOrder: sortOrder?.toLowerCase()
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error filtering products.");
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

// Summary page - shows current stock status overview
exports.summary = async (req, res) => {
  try {
    const products = await Product.findAll({ include: allProductIncludes });

    // Key metrics
    const totalProducts = products.length;
    const outOfStock = products.filter(p => p.quantity === 0);
    const lowStock = products.filter(p => p.quantity > 0 && p.quantity < 10);

    // Breakdown by product type - count, total quantity, and total value per type
    const typeBreakdown = {};
    for (const type of Object.keys(typeModelMap)) {
      const ofType = products.filter(p => p.type === type);
      typeBreakdown[type] = {
        count: ofType.length,
        totalQuantity: ofType.reduce((sum, p) => sum + p.quantity, 0),
        totalValue: ofType.reduce((sum, p) => sum + (p.pricePerItem * p.quantity), 0)
      };
    }

    res.render('summary', {
      totalProducts,
      outOfStock,
      lowStock,
      typeBreakdown
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading summary.");
  }
};

