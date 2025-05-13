import db from '../config/db';

const resolvers = {
//#region QUERY
        getProducts: async ({ limit }: any) => {
          return db('produkt').select('*').limit(limit);
        },
        getProducts_3: async({ limit }: any) => {
          const products = await db('produkt').select(
            'produkt.id',
            'produkt.namn as produkt_namn',
            'produkt.artikelnummer',
            'produkt.pris',
            'kategori.namn as kategori_namn'
          ).leftJoin('kategori', 'produkt.kategori_id', 'kategori.id')
          .limit(limit);
        const productsWithAttributes = await Promise.all(
          products.map(async (product) => {
            const attributes = await db('produktattribut')
              .select('attribut_namn', 'attribut_varde')
              .where('produkt_id', product.id);
      
            return {
              id: product.id,
              namn: product.produkt_namn,
              artikelnummer: product.artikelnummer,
              pris: product.pris,
              kategori: {
                namn: product.kategori_namn
              },
              attributer: attributes
            };
          })
        );
      
        return productsWithAttributes;
        },
        getProduct: async ({ id }: { id: number }) => {
          return await db('produkt').where({ id }).first();
        },
        getProduct_2_fields: async ({ limit }: any) => {
          return await db('produkt').select('namn', 'beskrivning').limit(limit)
        },
        getRandomProductID: async ({limit}: any) => {
          return await db('produkt').pluck('id').orderByRaw('RANDOM()').limit(limit)
        },
        getCategories: async ({ limit }: any) => {
          return await db('kategori').select('*').limit(limit);
        },
        getCategory: async ({ id }: { id: number }) => {
            return await db('kategori').where({ id }).first();
        },
//#endregion
//#region  MUTATION
postProduct: async ({ input }: any) => {
  try {
    const newProduct = await db('produkt')
      .insert({
        artikelnummer: input.artikelnummer,
        namn: input.namn,
        pris: input.pris,
        lagerantal: input.lagerantal,
        vikt: input.vikt,
        kategori_id: input.kategori_id,
        beskrivning: input.beskrivning,
      })
      .returning('*');

    return newProduct[0];
  } catch (error: any) {
    console.error("Database insert error: ", error);
    throw new Error(`Insert failed: ${error.message}`);
  }
},

postProduct_3: async ({ input }: any) => {

  console.log("helo")
  console.log(input);
  return await db.transaction(async (trx) => {
    const [newProduct] = await trx('produkt')
      .insert({
        artikelnummer: input.artikelnummer,
        namn: input.namn,
        pris: input.pris,
        lagerantal: input.lagerantal,
        vikt: input.vikt,
        kategori_id: input.kategori_id,
        beskrivning: input.beskrivning,
      })
      .returning('*'); 

    if (input.produkt_attribut && input.produkt_attribut.length > 0) {
      const attributToInsert = input.produkt_attribut.map((attr: any) => ({
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
},
putProduct: async ({ id, input }: { id: number; input: any }) => {
  return await db.transaction(async (trx) => {
    const { produkt_attribut, ...productData } = input;
    
    const [updatedProduct] = await trx('produkt')
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
      .where({ id: updatedProduct.kategori_id })
      .first();

    const attributer = await trx('produktattribut')
      .where({ produkt_id: id });

    return {
      ...updatedProduct,
      kategori,
      attributer,
    };
  });
},
deleteProduct: async ({ id }: { id: number }) => {
  try {
    const deletedCount = await db('produkt').where({ id }).del();
    if (deletedCount === 0) {
      throw new Error(`No product found with ID ${id}`);
    }
    return `Produkt med ID ${id} raderades.`;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
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