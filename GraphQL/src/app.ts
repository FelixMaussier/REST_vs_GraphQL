import express from 'express';
import schema from '../src/schemas/schema';
import { graphqlHTTP } from 'express-graphql';
import resolvers from './resolvers/resolver';
import cors from 'cors';
import morgan from 'morgan';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  exposedHeaders: ['x-cpu', 'x-ram']
}));
app.use(morgan('dev'));

app.use((req, res, next) => {
  const startCpu = process.cpuUsage();
  const startMem = process.memoryUsage();

  const originalEnd = res.end.bind(res);

  (res.end as typeof res.end) = function (
    chunk?: any,
    encoding?: BufferEncoding | (() => void),
    cb?: () => void
  ): any {
    const endCpu = process.cpuUsage(startCpu);
    const endMem = process.memoryUsage();

    const cpuMs = (endCpu.user + endCpu.system) / 1000;
    const heapChangeMb = Math.max(
      (endMem.heapUsed - startMem.heapUsed) / 1024 / 1024,
      0
    );

    res.setHeader('x-cpu', cpuMs.toFixed(2));
    res.setHeader('x-ram', heapChangeMb.toFixed(2));

    return originalEnd(chunk as any, encoding as any, cb);
  };

  next();
});

app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: resolvers,
  graphiql: true
}));

export default app;