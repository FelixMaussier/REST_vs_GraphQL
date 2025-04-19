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

app.use((req, res, next) => {
  const startCPU = process.cpuUsage();
  const startMem = process.memoryUsage().heapUsed;

  res.on('finish', () => {
    const endCPU = process.cpuUsage(startCPU);
    const endMem = process.memoryUsage().heapUsed;
    const cpuMicroseconds = endCPU.user + endCPU.system;
    const memDiffMB = (endMem - startMem) / 1024 / 1024;

    console.log(`--- Performance for ${req.method} ${req.originalUrl} ---`);
    console.log(`CPU time: ${cpuMicroseconds} µs`);
    console.log(`Memory diff: ${memDiffMB.toFixed(2)} MB`);
    console.log('---------------------------------------------');
  });
  next();
});


app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: resolvers,
  graphiql: true
}));

export default app;