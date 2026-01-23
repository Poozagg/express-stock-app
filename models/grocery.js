// TODO: Implement the Grocery model
// Expected fields:
// - expirationDate: Date
// - nutritionalInfo: String
// - organic: Boolean

module.exports = (sequelize, DataTypes) => {
    const Grocery = sequelize.define('Grocery', {
      // TODO: Define fields here
    });
  
    Grocery.associate = (models) => {
      // TODO: Define associations here
      // Grocery.belongsTo(models.Product);
    };
  
    return Grocery;
  };
  
  