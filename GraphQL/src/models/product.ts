const db = require('../config/db');

const Product = {
    query: () => db('products').select('*'),
};

module.exports = Product;