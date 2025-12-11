// TODO: Implement the Groceries model
// Expected fields:
// - expirationDate: Date
// - nutritionalInfo: String
// - organic: Boolean

module.exports = (sequelize, DataTypes) => {
    const Groceries = sequelize.define('Groceries', {
      // TODO: Define fields here
    });
  
    Groceries.associate = (models) => {
      // TODO: Define associations here
      // Groceries.belongsTo(models.Product);
    };
  
    return Groceries;
  };
  
  