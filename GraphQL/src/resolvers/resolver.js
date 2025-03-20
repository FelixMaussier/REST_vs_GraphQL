const Product = require('../models/Product');

const resolvers = {
    Query: {
        async products() {
            return await Product.query();
        },
    },
};