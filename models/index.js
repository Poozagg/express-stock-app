const { Sequelize, DataTypes } = require("sequelize");
const config = require("../config/database.js");

// Create a new Sequelize instance using the configuration from config/database.js
const sequelize = new Sequelize({
  dialect: config.dialect,
  storage: config.storage,
});

const db = {};

// passing details/key-value pairs into the empty db object
db.sequelize = sequelize; //configuration
db.Sequelize = Sequelize; //Sequelize class

//creating product table and passing sequelize and DataTypes to it
db.Product = require("./product.js")(sequelize, DataTypes); 

module.exports = db;