const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');

// GET all products
router.get('/', stockController.index);

// GET create a new product page
router.get('/createPage', stockController.createPage);

// POST create a new product
router.post('/create', stockController.create);

// GET search products
router.get('/search', stockController.search);

// GET sort products
router.get('/sort', stockController.sort);

// GET product details
router.get('/details/:id', stockController.getDetails);

// GET currency conversion
router.get('/details/:id/convert', stockController.convertCurrency);

// TODO: Add routes for update and delete operations
// DELETE a product
router.post('/delete/:id', stockController.delete);


module.exports = router;

