import { buildSchema } from 'graphql';
import resolvers from '../resolvers/resolver';

const schema = buildSchema(`
  type Produkt {
    id: ID!
    artikelnummer: String!
    namn: String!
    pris: Float!
    lagerantal: Int!
    vikt: Float!
    kategori_id: Int!
    beskrivning: String!
  }

  input ProduktInput {
    artikelnummer: String!
    namn: String!
    pris: Float!
    lagerantal: Int!
    vikt: Float!
    kategori_id: Int!
    beskrivning: String!
  }

  type Query {
    getProducts: [Produkt]
    getProduct(id: ID!): Produkt
  }

  type Mutation {
    postProduct(input: ProduktInput): Produkt
    putProduct(id: ID!, input: ProduktInput): Produkt
    deleteProduct(id: ID!): String
  }
`);

export default schema;