import db from '../config/db';

const resolvers = {
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
        postProduct: async ({ input }: any) => {
            const [newProduct] = await db('produkt')
              .insert(input)
              .returning('*');
            return newProduct;
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
    
};

export default resolvers;