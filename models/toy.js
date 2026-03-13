module.exports = (sequelize, DataTypes) => {
    const Toy = sequelize.define('Toy', {
      ageGroup: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      material: {
        type: DataTypes.STRING
      },
      batteryOperated: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    });
  
    Toy.associate = (models) => {
      Toy.belongsTo(models.Product);
    };
  
    return Toy;
  };
  
  