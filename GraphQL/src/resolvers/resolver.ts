import db from '../config/db';

const resolvers = {
    Query: {
        getKategori: () => {
            return db.select('*').from('kategori');
        },
        getProducts: () => {
            return db.select('*').from('produkt');
        }
    }
};

export default resolvers;