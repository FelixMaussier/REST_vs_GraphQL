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

  console.log("helo");
  // const [newProduct] = await db('produkt')
  //   .insert({
  //     artikelnummer: input.artikelnummer,
  //     namn: input.namn,
  //     pris: input.pris,
  //     lagerantal: input.lagerantal,
  //     vikt: input.vikt,
  //     kategori_id: input.kategori_id,
  //     beskrivning: input.beskrivning
  //   })
  //   .returning('*');

  // console.log("newProduct: ", newProduct);

  // const productAttributes = (input.attribut || []).map((attr: any) => ({
  //   produkt_id: newProduct.id,
  //   attribut_namn: attr.namn,
  //   attribut_varde: attr.varde
  // }));

  // if (productAttributes.length > 0) {
  //   await db('produktattribut').insert(productAttributes);
  // }
  
  // const attributes = await db('produktattribut')
  //   .where({ produkt_id: newProduct.id });

  // return {
  //   artikelnummer: newProduct.artikelnummer,
  //   namn: newProduct.namn,
  //   pris: newProduct.pris,
  //   lagerantal: newProduct.lagerantal,
  //   vikt: newProduct.vikt,
  //   kategori_id: newProduct.kategori_id,
  //   beskrivning: newProduct.beskrivning,
  //   id: newProduct.id
  // };
},
putProduct: async ({ id, input }: { id: number; input: any }) => {
  return (await db('produkt')
    .where({ id })
    .update(input)
    .returning('*'))[0];
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