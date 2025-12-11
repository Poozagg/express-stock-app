// TODO: Implement the Books model
// Expected fields:
// - author: String
// - isbn: String
// - genre: String
// - publicationDate: Date

module.exports = (sequelize, DataTypes) => {
    const Books = sequelize.define('Books', {
      // TODO: Define fields here
    });
  
    Books.associate = (models) => {
      // TODO: Define associations here
      // Books.belongsTo(models.Product);
    };
  
    return Books;
  };
  
  