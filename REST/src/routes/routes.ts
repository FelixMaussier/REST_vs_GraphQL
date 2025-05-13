//import express from 'express';
import express, { Request, Response } from 'express';
import process from 'process';
const api = express.Router();
import db from '../config/db';

//#region GET


api.get('/products', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const products = await db('produkt').select('*').limit(limit);
    res.json({ data: products });
  } catch (err) {
    console.error('Error in /products:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

api.get('/products_3', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;

    // Hämta produkter med kategori-info (se till att inkludera id)
    const products = await db('produkt')
      .select(
        'produkt.id',
        'produkt.namn as produkt_namn',
        'produkt.pris',
        'produkt.artikelnummer',
        'kategori.namn as kategori_namn',
        'kategori.beskrivning as kategori_beskrivning'
      )
      .leftJoin('kategori', 'produkt.kategori_id', 'kategori.id')
      .limit(limit);

    const productsWithAttributes = await Promise.all(
      products.map(async (product) => {
        const attributes = await db('produktattribut')
          .select('attribut_namn', 'attribut_varde')
          .where('produkt_id', product.id);

          return {
            id: product.id,
            namn: product.produkt_namn,
            pris: product.pris,
            artikelnummer: product.artikelnummer,
            kategori: {
              namn: product.kategori_namn,
              beskrivning: product.kategori_beskrivning
            },
            attributes
          };
      })
    );

    console.log(productsWithAttributes);
    res.json({ data: productsWithAttributes });
} catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'Internal server error' });
}
})

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

api.get('/getProducts_2_fields', async (req, res) => {
  const limit = parseInt(req.query.limit as string) || 10;

  try {
    const allProducts = await db('produkt').select('*').limit(limit);

    const filteredProducts = allProducts.map(product => ({
      namn: product.namn,
      beskrivning: product.beskrivning,
    }));

    res.json(filteredProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal Server Error" });
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

  api.post('/products_3', async (req, res) => {
    try {
      const {
        artikelnummer,
        namn,
        pris,
        lagerantal,
        vikt,
        beskrivning,
        kategori_id,
        produkt_attribut, // Här hämtar vi attributen
      } = req.body;
  
      // Börja en databas-transaktion för att skapa produkten och attributen
      const newProduct = await db.transaction(async (trx) => {
        // Skapa en ny produkt i "produkt" tabellen
        const [newProduct] = await trx('produkt')
          .insert({
            artikelnummer,
            namn,
            pris,
            lagerantal,
            vikt,
            kategori_id,
            beskrivning,
          })
          .returning('*');
  
        if (produkt_attribut && produkt_attribut.length > 0) {
          const attributToInsert = produkt_attribut.map((attr: any) => ({
            produkt_id: newProduct.id,
            attribut_namn: attr.attribut_namn,
            attribut_varde: attr.attribut_varde,
          }));
  
          await trx('produktattribut').insert(attributToInsert);
        }
  
        const kategori = await trx('kategori')
          .where({ id: newProduct.kategori_id })
          .first();
  
        const attributer = await trx('produktattribut')
          .where({ produkt_id: newProduct.id });
  
        return {
          ...newProduct,
          kategori,
          attributer,
        };
      });
  
      res.status(201).json(newProduct);
  
    } catch (error) {
      console.error("Error inserting product: ", error);
      res.status(500).json({ error: "Something went wrong!" });
    }
  });

//#endregion

//#region PUT
api.put('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { produkt_attribut, ...productData } = req.body;

    const updatedProduct = await db.transaction(async (trx) => {
      
      const [updated] = await trx('produkt')
        .where({ id })
        .update(productData)
        .returning('*');

      await trx('produktattribut')
        .where({ produkt_id: id })
        .del();

      if (produkt_attribut && produkt_attribut.length > 0) {
        const attributToInsert = produkt_attribut.map((attr: any) => ({
          produkt_id: id,
          attribut_namn: attr.attribut_namn,
          attribut_varde: attr.attribut_varde,
        }));

        await trx('produktattribut').insert(attributToInsert);
      }

      const kategori = await trx('kategori')
        .where({ id: updated.kategori_id })
        .first();

      const attributer = await trx('produktattribut')
        .where({ produkt_id: id });

      return {
        ...updated,
        kategori,
        attributer,
      };
    });

    res.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Something went wrong!" });
  }
});
//#endregion

//#region DELETE
api.delete('/products/:id', async (req, res) => {
    const { id } = req.params;
    const deletedCount = await db('produkt').where({ id }).del();
    if (deletedCount === 0) {
      throw new Error(`No product found with ID ${id}`);
    }
    res.json({ message: `Produkt med ID ${id} raderades.` });
});

//#endregion

export default api;