const express = require("express");
const app = express();
const port = 3000;
const productRoutes = require('./routes/productRoutes');

app.set('view engine', 'pug');
app.set('views', './views');
app.use(express.static('./public'));

// Use product routes
app.use('/', productRoutes);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
    console.log(`Visit http://localhost:${port}`);  
});