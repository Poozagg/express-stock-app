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
db.Sequelize = Sequelize; //Sequelize class, using global blueprint

//creating product table and passing sequelize and DataTypes to it
db.Product = require("./product.js")(sequelize, DataTypes); 
db.Clothing = require('./clothing.js')(sequelize, DataTypes);
db.Electronic = require('./electronic.js')(sequelize, DataTypes);

// Set up associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;