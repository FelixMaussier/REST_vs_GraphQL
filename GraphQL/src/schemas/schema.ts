import { GraphQLObjectType, GraphQLSchema, GraphQLList, GraphQLString, GraphQLID, GraphQLFloat, GraphQLInt } from 'graphql';
import db from '../config/db';
import resolvers from '../resolvers/resolver';



const KategoriType = new GraphQLObjectType({
  name: 'Kategori',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    beskrivning: { type: GraphQLString },
    skapad: { type: GraphQLFloat },
    uppdaterad: { type: GraphQLFloat }
  })
});

const ProduktType = new GraphQLObjectType({
  name: 'Produkt',
  fields: () => ({
    id: { type: GraphQLID },
    artikelnummer: { type: GraphQLString },
    namn: { type: GraphQLString },
    pris: { type: GraphQLFloat },
    lagerantal: { type: GraphQLInt },
    vikt: { type: GraphQLFloat },
    kategoriID: { type: GraphQLID },
    beskrivning: { type: GraphQLString }
  })
});


const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    getKategorier: {
      type: new GraphQLList(KategoriType),
      resolve: async () => {
        return await db('kategori').select('*');
      },
    },
    getProducts: {
      type: new GraphQLList(ProduktType),
      resolve: async () => {
        return await db('produkt').select('*');
      },
    },
  },
});

export default new GraphQLSchema({
  query: RootQuery,
});