import db from '../config/db';

const resolvers = {
    Query: {
        getProducts: () => {
            return db.select('*').from('products');
        },
        getProductDescription: () => {
            return db.select('description').from('products');
        }
    },
    Mutation: {
        createUser: () => {
            return "product created";
        }
    }
};

export default resolvers;