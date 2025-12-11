const express = require('express');
const app = express();
const port = 3000;
const db = require('./models');
const productRoutes = require('./routes/productRoutes');

app.set('view engine', 'pug');
app.set('views', './views');
app.use(express.static('./public'));
app.use(express.urlencoded({ extended: true }));

// Use product routes
app.use('/', productRoutes);

db.sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
    console.log('Database synchronized');
  });
}).catch((error) => {
  console.error('Unable to synchronize the database:', error);
});

