module.exports = (sequelize, DataTypes) => {
    const Book = sequelize.define('Book', {
      author: {
        type: DataTypes.STRING
      },
      isbn: {
        type: DataTypes.STRING
      },
      genre: {
        type: DataTypes.STRING
      },
      publicationDate: {
        type: DataTypes.DATE
      }
    });
  
    Book.associate = (models) => {
      Book.belongsTo(models.Product);
    };
  
    return Book;
  };
  
  