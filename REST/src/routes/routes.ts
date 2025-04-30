//import express from 'express';
import express, { Request, Response } from 'express';
import process from 'process';
const api = express.Router();
import db from '../config/db';

//#region GET
api.get('/products', async (req, res) => {
  const limit = parseInt(req.query.limit as string) || 10;
  const products = await db('produkt').select('*').limit(limit);
  res.json({ data: products });
});

api.get('/products/:id', async (req, res) => {
  const { id } = req.params;
  //const limit = parseInt(req.query.limit as string) || 10;
  const products = await db('produkt').where({ id }).first();

  res.json({ data: products})
});

api.get('/categories', async (req, res) => {
  const limit = parseInt(req.query.limit as string) || 10;
  const categories = await db('kategori').select('*').limit(limit);
  res.json({ data: categories });
});

api.get('/category/:id', async (req, res) => {
  const { id } = req.params;
  const categories = await db('kategori').where({ id }).first();
  res.json({ data: categories });
});


api.get('/getRandomID', async (req, res) => {
  try {  
    const limit = parseInt(req.query.limit as string) || 10;
    const productIds = await db('produkt').select('id').orderByRaw('RANDOM()').limit(limit);                      
    res.json(productIds.map(product => product.id));  

  } catch (error) {
    console.error("Error fetching product IDs:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

api.get('/getRandomCategoryID', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const categoryIds = await db('kategori').select('id').orderByRaw('RANDOM()').limit(limit);
    res.json(categoryIds.map(category => category.id));
  } catch (error) {
    console.error("Error fetching category IDs:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});
//#endregion

//#region POST
api.post('/products', async (req, res) => {
      const {
        artikelnummer,
        namn,
        pris,
        lagerantal,
        vikt,
        kategori_id,
        beskrivning
      } = req.body;

      const [nyProdukt] = await db('produkt').insert({
        artikelnummer,
        namn,
        pris,
        lagerantal,
        vikt,
        kategori_id,
        beskrivning
      }).returning('*');
      console.log(nyProdukt , " skapdes")
      res.status(201).json({ message: "Produkten skapades.", produkt: nyProdukt });
  });

//#endregion

//#region PUT
api.put('/products', async (req, res) => {
    const {  
        id,
        artikelnummer ,
        namn,
        pris,
        lagerantal,
        vikt,
        kategori_id,
        beskrivning,
    } = req.body;

    const updated = await db('produkt')
      .where({ id })
      .update({
        artikelnummer,
        namn,
        pris,
        lagerantal,
        vikt,
        kategori_id,
        beskrivning,
      })
      .returning('*');
  
      res.json({ message: "Produkten uppdaterades.", produkt: updated[0] });
});
//#endregion

//#region DELETE
api.delete('/products/:id', async (req, res) => {
    const { id } = req.params;
    const deletedCount = await db('produkt').where({ id }).del();
    res.json({ message: `Product with ID ${id} deleted.` });
});

//#endregion

export default api;