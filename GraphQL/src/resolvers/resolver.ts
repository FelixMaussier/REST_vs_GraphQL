import db from '../config/db';

const resolvers = {
//#region QUERY
        getProducts: async ({ limit }: any) => {
            try {
              const products = await db('produkt').select('*').limit(limit);
              return products;
            } catch (error) {
              console.error("error: " , error);
              throw new Error("Could not fetch products");
            }
        },
        getProduct: async ({ id }: { id: number }) => {
          return await db('produkt').where({ id }).first();
        },
        getCategories: async ({ limit }: any) => {
            try {
              const categories = await db('kategori').select('*').limit(limit);
              return categories;
            } catch (error) {
              console.error("error: " , error);
              throw new Error("Could not fetch categories");
            }
        },
        getCategory: async ({ id }: { id: number }) => {
            return await db('kategori').where({ id }).first();
        },
//#endregion
//#region  MUTATION
postProduct: async ({ input }: any) => {
  try {
    console.log("Input artikelnummer:", input.artikelnummer);  // Logga artikelnummer

    // Kontrollera om artikelnumret redan finns i databasen
    const existingProduct = await db('produkt')
      .where({ artikelnummer: input.artikelnummer })
      .first();  // Hämta den första matchande posten

    if (existingProduct) {
      throw new Error(`Produkt med artikelnummer ${input.artikelnummer} finns redan.`);
    }

    const [newProduct] = await db('produkt')
      .insert({
        artikelnummer: input.artikelnummer,
        namn: input.namn,
        pris: input.pris,
        lagerantal: input.lagerantal,
        vikt: input.vikt,
        kategori_id: input.kategori_id,
        beskrivning: input.beskrivning
      })
      .returning('*');  // Returnera den nyinlagda produkten

      console.log("newProduct: ",newProduct);  // Logga hela resultatet
    if (!newProduct) {
      throw new Error('Misslyckades att skapa produkt. Ingen data returnerades.');
    }

    const productAttributes = (input.attribut || []).map((attr: any) => ({
      produkt_id: newProduct.id, 
      attribut_namn: attr.namn,
      attribut_varde: attr.varde
    }));

    if (productAttributes.length > 0) {
      await db('produktattribut').insert(productAttributes);
    }
    
    const attributes = await db('produktattribut')
      .where({ produkt_id: newProduct.id });
    
    return newProduct;
  } catch (error) {
    console.error('Fel vid skapande av produkt:', error);
    throw new Error('Kunde inte skapa produkt');
  }
},
        putProduct: async ({ id, input }: any) => {
            const [updatedProduct] = await db('produkt')
              .where({ id })
              .update(input)
              .returning('*');
            return updatedProduct;
        },
        deleteProduct: async ({ id }: { id: number }) => {
            await db('produkt').where({ id }).del();
            return `Produkt med ID ${id} raderades.`;
        },

  //#endregion

  //#region Types
  Produkt:{
    kategori: async (parent: any) => {
      const category = await db('kategori').where({ id: parent.kategori_id }).first();
      return category;
    },
    produktAttribut: async (parent: any) => {
      const attributes = await db('produkt_attribut').where({ produkt_id: parent.id });
      return attributes;
    }
  }
  //#endregion
};

export default resolvers;