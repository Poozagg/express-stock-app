// TODO: Implement the Book model
// Expected fields:
// - author: String
// - isbn: String
// - genre: String
// - publicationDate: Date

module.exports = (sequelize, DataTypes) => {
    const Book = sequelize.define('Book', {
      // TODO: Define fields here
    });
  
    Book.associate = (models) => {
      // TODO: Define associations here
      // Book.belongsTo(models.Product);
    };
  
    return Book;
  };
  
  