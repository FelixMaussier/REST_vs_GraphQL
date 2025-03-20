import db from '../config/db';

const Product = {
    query: () => db('products').select('*'),
};

export default Product;
