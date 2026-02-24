const express = require("express");
const router = express.Router();
const stockController = require("../controllers/stockController.js");

router.get("/", stockController.index);

module.exports = router;