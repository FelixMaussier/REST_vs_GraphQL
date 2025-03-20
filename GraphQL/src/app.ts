import express from 'express';
import schema from '../src/schemas/schema';
import { graphqlHTTP } from 'express-graphql';


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', graphqlHTTP({
  schema,
  graphiql: true
}));

export default app;