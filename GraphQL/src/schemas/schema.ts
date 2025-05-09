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
  kategori: Kategori
  beskrivning: String
  attributer: [ProduktAttribut!]!
}

type Kategori {
  id: ID!
  namn: String!
  beskrivning: String
  produkter: [Produkt!]!
  skapad_datum: String!
  uppdaterad_datum: String!
}

type ProduktAttribut {
  id: ID!
  produkt: Produkt!
  attribut_namn: String!
  attribut_varde: String!
}

input ProduktInput {
  artikelnummer: String!
  namn: String!
  pris: Float!
  kategori_id: Int
  beskrivning: String
}

type Query {
  getProducts(limit: Int): [Produkt!]!
  getProducts_3(limit: Int): [Produkt!]!
  getProduct(id: ID!): Produkt
  getRandomProductID(limit: Int!): [ID!]!
  getCategories(limit: Int): [Kategori]
  getCategory(id: ID!): Kategori
}

type Mutation {
  postProduct(id: ID!): [Produkt!]!
  putProduct(id: ID!, input: ProduktInput!): Produkt! 
  deleteProduct(id: ID!): [Produkt!]!
}
`);

export default schema;