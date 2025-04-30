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
    .returning('*');

  console.log("newProduct: ", newProduct);

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

  return {
    artikelnummer: newProduct.artikelnummer,
    namn: newProduct.namn,
    pris: newProduct.pris,
    lagerantal: newProduct.lagerantal,
    vikt: newProduct.vikt,
    kategori_id: newProduct.kategori_id,
    beskrivning: newProduct.beskrivning,
    id: newProduct.id
  };
},
putProduct: async ({ id, input }: { id: number; input: any }) => {
  console.log("id: ", id);
  console.log("input: ", input);
  
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