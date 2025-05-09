import { metricsData } from "../types/RestDataType";

function calculateRequestsPer10ms(
  timestamps: number[],
  startTime: number
): number[] {
  if (timestamps.length === 0) return [];

  // Beräkna max antal intervall baserat på sista anropet
  const lastTime = Math.max(...timestamps);
  const totalIntervals = Math.floor((lastTime - startTime) / 10 + 1);

  // Skapa en array fylld med nollor
  const bins: number[] = new Array(totalIntervals).fill(0);

  // Uppdatera räknaren för varje timestamp
  for (const time of timestamps) {
    const index = Math.floor((time - startTime) / 10);
    bins[index]++;
  }

  return bins;
}

export const measureTime = async <T,>(
  label: string,
  func: () => Promise<T>,
  numOfReq: number = 1,
  method: string
): Promise<{
  results: T[];
  metrics: metricsData;
  requestLogs: string[];
}> => {
  const start = performance.now();

  let requestCount = 0;
  const results: T[] = [];
  const requestLogs: string[] = [];
  const requestEndTimes: number[] = [];

  const promises = Array.from({ length: numOfReq }).map(async (_, i) => {
    const reqStart = performance.now();
    const result = await func();
    const reqEnd = performance.now();

    const duration = reqEnd - reqStart;
    results[i] = result;
    requestCount++;

    requestEndTimes.push(reqEnd);

    const logMessage = `[${label}] Request #${i + 1}: ${duration.toFixed(
      2
    )} ms`;
    requestLogs.push(logMessage);
    console.log(logMessage);
  });

  await Promise.all(promises);

  const end = performance.now();
  const totalTime = end - start;
  const responseTime = totalTime / numOfReq;
  const throughput = requestCount / (totalTime / 1000);
  const requestsPer10ms = calculateRequestsPer10ms(requestEndTimes, start);

  const metrics: metricsData = {
    api: label.split(" ")[0],
    method: method,
    numOfReq: numOfReq,
    totalTime: Number(totalTime.toFixed(2)),
    throughput: Number(throughput.toFixed(2)),
    avaregeResponseTime: Number(responseTime.toFixed(2)),
    requestsPer10ms: requestsPer10ms,
  };

  return { results, metrics, requestLogs };
};
