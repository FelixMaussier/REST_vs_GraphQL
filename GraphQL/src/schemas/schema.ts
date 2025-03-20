import { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLID, GraphQLList } from 'graphql';

const ProductDef = new GraphQLObjectType({
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
    products: {
      type: new GraphQLList(ProductDef),
      resolve(parent, args) {
        //return products;
      }
    }
  }
});



export default new GraphQLSchema({
  query: RootQuery
});