module.exports = (sequelize, DataTypes) => {
    const Electronics = sequelize.define('Electronics', {
      brand: {
        type: DataTypes.STRING
      },
      warranty: {
        type: DataTypes.STRING
      }
    });
  
    Electronics.associate = (models) => {
      Electronics.belongsTo(models.Product);
    };
  
    return Electronics;
  };
  