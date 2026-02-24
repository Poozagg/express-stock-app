const products = {};

exports.index = async (req, res) => {
    try {
        res.render("index", { products: products });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching products.");
    }
};