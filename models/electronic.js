module.exports = (sequelize, DataTypes) => {
    const Electronic = sequelize.define('Electronic', {
      brand: {
        type: DataTypes.STRING
      },
      warranty: {
        type: DataTypes.STRING
      }
    });
  
    Electronic.associate = (models) => {
      Electronic.belongsTo(models.Product);
    };
  
    return Electronic;
  };
  