module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define('Product', {
      id: {
        type: DataTypes.STRING,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false
      }
    });

    Product.prototype.getProductTypeDetails = function() {
      const typeData = this.Clothing || this.Electronic || this.Toy || this.Book || this.Grocery;
    
      if (!typeData) return [];

      const excludeFields = ['id', 'createdAt', 'updatedAt', 'ProductId'];

      const fieldLabels = {
        size: 'Size', material: 'Material', color: 'Color',
        brand: 'Brand', gender: 'Gender', warranty: 'Warranty',
        model: 'Model', powerConsumption: 'Power Consumption',
        dimensions: 'Dimensions', author: 'Author', isbn: 'isbn',
        genre: 'Genre', publicationDate: 'Publication Date', 
        expiretionDate: 'Expiration Date', nutritionalInfo: 'Nutritional Info', 
        organic: 'Organic', ageGroup: 'Age Group', batteryOperated: 'Battery Operated'
      }

      return Object.keys(typeData.dataValues)
        .filter(key => !excludeFields.includes(key))
        .map(key => ({ label: fieldLabels[key] || key, value: typeData[key] }));
    };
  
    Product.associate = (models) => {
      Product.hasOne(models.Clothing);
      Product.hasOne(models.Electronic);
      Product.hasOne(models.Toy);
      Product.hasOne(models.Book);
      Product.hasOne(models.Grocery);
    };
  
    return Product;
  };
  