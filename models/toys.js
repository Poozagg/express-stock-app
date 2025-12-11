// TODO: Implement the Toys model
// Expected fields:
// - ageGroup: String
// - material: String
// - batteryOperated: Boolean

module.exports = (sequelize, DataTypes) => {
    const Toys = sequelize.define('Toys', {
      // TODO: Define fields here
    });
  
    Toys.associate = (models) => {
      // TODO: Define associations here
      // Toys.belongsTo(models.Product);
    };
  
    return Toys;
  };
  
  