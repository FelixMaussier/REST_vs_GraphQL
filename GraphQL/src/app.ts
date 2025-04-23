import express from 'express';
import schema from '../src/schemas/schema';
import { graphqlHTTP } from 'express-graphql';
import resolvers from './resolvers/resolver';
import cors from 'cors';
import morgan from 'morgan';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('dev'));


app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: resolvers,
  graphiql: true
}));

export default app;