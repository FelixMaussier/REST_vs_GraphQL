//import express from 'express';
import express, { Request, Response } from 'express';
import process from 'process';
const api = express.Router();
import db from '../config/db';

//#region GET
api.get('/products', async (req, res) => {
    //const limit = parseInt(req.query.limit as string) || 10;
    try {
        //const products = await db('produkt').select('*').limit(limit);
        const products = await db('produkt').select('*');
        res.json(products);
    } catch (err) {
        console.error("DB error:", err);
        res.status(500).json({ error: "Failed to fetch products" });
    }
});

api.get('/products/:id', async (req, res) => {
    const { id } = req.params;
    const product = await db('produkt').where({ id }).first();
    console.log(product, " produkt");
    res.json(product);
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
api.delete('/products/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const deletedCount = await db('produkt').where({ id }).del();
    res.json({ message: `Product with ID ${id} deleted.` });
});

//#endregion

export default api;