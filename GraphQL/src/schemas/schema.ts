import { GraphQLObjectType, GraphQLSchema, GraphQLList, GraphQLString, GraphQLID } from 'graphql';
import db from '../config/db';
import resolvers from '../resolvers/resolver';


const ProductType = new GraphQLObjectType({
  name: 'Product',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    price: { type: GraphQLString },
    description: { type: GraphQLString }
  })
});


const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    getProducts: {
      type: new GraphQLList(ProductType),
      resolve: resolvers.Query.getProducts
    }
  }
});


const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createProduct: {
      type: GraphQLString,
      args: {
        name: { type: GraphQLString },
        price: { type: GraphQLString },
        description: { type: GraphQLString }
      },
      resolve: resolvers.Mutation.createUser
    }
  }
});


export default new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});