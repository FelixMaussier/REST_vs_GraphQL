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

  type Kategori {
    id: ID!
    namn: String!
    beskrivning: String!
    skadad_datum: String!
    uppdaterad_datum: String!
  }

  type ProduktAttribut {
  id: ID!
  attribut_namn: String!
  attribut_varde: String!
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

  input KategoriInput {
    namn: String!
    beskrivning: String!
  }

  type Query {
    getProducts(limit: Int): [Produkt]
    getProduct(id: ID!): Produkt
    getCategories(limit: Int): [Kategori]
    getCategory(id: ID!): Kategori
  }

  type Mutation {
    postProduct(input: ProduktInput!): Produkt!
    putProduct(id: ID!, input: ProduktInput): Produkt
    deleteProduct(id: ID!): String
  }
`);

export default schema;