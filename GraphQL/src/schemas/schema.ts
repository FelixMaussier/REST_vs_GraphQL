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
  produktAttribut: [ProduktAttribut!]!
}

type Kategori {
  id: ID!
  namn: String!
  beskrivning: String!
  skadad_datum: String!
  uppdaterad_datum: String!
}

type ProduktAttribut {
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
  attribut: [ProduktAttributInput!]!
}

input ProduktAttributInput {
  namn: String!
  varde: String!
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
  putProduct(id: Int!, input: ProduktInput!): Produkt!
  deleteProduct(id: ID!): String
}
`);

export default schema;