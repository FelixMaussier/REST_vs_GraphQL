import { Performance } from "perf_hooks";

interface PerformanceMemory {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

declare global {
  interface Performance {
    memory?: PerformanceMemory;
  }
}
export const measureTime = async <T,>(
  label: string,
  func: () => Promise<T>,
  numRequests: number = 1
): Promise<T[]> => {
  const start = performance.now();
  const memoryStart = (performance as any).memory?.usedJSHeapSize || 0;

  let requestCount = 0;
  const results: T[] = [];

  const promises = Array.from({ length: numRequests }).map(async (_, i) => {
    const result = await func();
    results[i] = result; // undvik race conditions
    requestCount++;
  });

  await Promise.all(promises);

  const end = performance.now();
  const memoryEnd = performance.memory?.usedJSHeapSize || 0;

  const responseTime = (end - start) / numRequests;
  const elapsedTimeInSeconds = (end - start) / 1000;
  const throughput = requestCount / elapsedTimeInSeconds;
  const memoryUsed = (memoryEnd - memoryStart) / 1024 / 1024; // i MB

  console.log(`\n--- Performance Metrics: ${label} ---`);
  console.log(`Total requests: ${requestCount}`);
  console.log(`Avg response time: ${responseTime.toFixed(2)} ms`);
  console.log(`Throughput: ${throughput.toFixed(2)} req/s`);

  if (performance.memory) {
    console.log(`Memory used: ${memoryUsed.toFixed(2)} MB`);
    console.log(
      `Heap total: ${(performance.memory.totalJSHeapSize / 1024 / 1024).toFixed(
        2
      )} MB`
    );
    console.log(
      `Heap limit: ${(performance.memory.jsHeapSizeLimit / 1024 / 1024).toFixed(
        2
      )} MB`
    );
  } else {
    console.log("Memory info not available in this browser.");
  }

  return results;
};
