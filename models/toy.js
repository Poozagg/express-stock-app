// TODO: Implement the Toy model
// Expected fields:
// - ageGroup: String
// - material: String
// - batteryOperated: Boolean

module.exports = (sequelize, DataTypes) => {
    const Toy = sequelize.define('Toy', {
      // TODO: Define fields here
    });
  
    Toy.associate = (models) => {
      // TODO: Define associations here
      // Toy.belongsTo(models.Product);
    };
  
    return Toy;
  };
  
  