const express = require("express");
const app = express();
const port = 3000;
const productRoutes = require('./routes/productRoutes');
const db = require('./models');

app.set('view engine', 'pug');
app.set('views', './views');
app.use(express.static('./public'));
app.use(express.urlencoded({ extended: true })); 
app.use(express.json());

// Use product routes
app.use('/', productRoutes);

// do not run server if this file is being required (during supertesting)
db.sequelize.sync().then(() => {
  if (require.main === module) {
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
      console.log('Database synchronized');
    });
  }
}).catch((error) => {
  console.error('Unable to synchronize the database:', error);
});

module.exports = app;