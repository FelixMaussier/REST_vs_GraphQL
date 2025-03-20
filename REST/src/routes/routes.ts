import express from 'express';
const api = express.Router();
import db from '../config/db';

api.get('/', async (req, res) => {
    const products = await db('products').select('*');
    console.log('products');
    res.json(products);
});

api.get('/banana', (req, res) => {
    res.send('Hello would you like a banana?');
});

api.get('/products/name', (req, res) => {
    res.send('Hello would you like to get the name of the product?');
});

api.get('/products/:id', (req, res) => {
    res.send(`Hello would you like to get the product with the id of ${req.params.id}?`);
});

export default api;