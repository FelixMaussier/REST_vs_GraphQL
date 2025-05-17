import express from 'express';
import routes from './routes/routes';
import cors from 'cors';
import morgan from 'morgan';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cors({ exposedHeaders: ['x-cpu', 'x-ram'] }));

app.use((req, res, next) => {
  const startTime = process.hrtime();
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
    const elapsedTime = process.hrtime(startTime);
    
    // Konvertera elapsed time till millisekunder
    const elapsedMs = elapsedTime[0] * 1000 + elapsedTime[1] / 1000000;
    
    // CPU-tid i millisekunder
    const cpuMs = (endCpu.user + endCpu.system) / 1000;
    
    // CPU-användning i procent (av en enda kärna)
    const cpuPercent = (cpuMs / elapsedMs) * 100;
    
    // Minnessanvändning i MB
    const heapChangeMb = Math.max(
      (endMem.heapUsed - startMem.heapUsed) / 1024 / 1024,
      0
    );
    
    res.setHeader('x-cpu', cpuPercent.toFixed(2));
    res.setHeader('x-ram', heapChangeMb.toFixed(2));
    
    return originalEnd(chunk as any, encoding as any, cb);
  };
  
  next();
});

app.use('/', routes);

export default app;