module.exports = (sequelize, DataTypes) => {
    const Grocery = sequelize.define('Grocery', {
      expiretionDate: {
        type: DataTypes.DATE
      },
      nutritionalInfo: {
        type: DataTypes.STRING
      },
      organic: {
        type: DataTypes.BOOLEAN
      }
    });
  
    Grocery.associate = (models) => {
      Grocery.belongsTo(models.Product);
    };
  
    return Grocery;
  };
  
  