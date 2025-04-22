import { metricsData } from "../types/RestDataType";

// Hjälpfunktion för att räkna antal requests per 10ms-intervall
function calculateRequestsPer10ms(
  timestamps: number[],
  startTime: number
): number[] {
  const bins: number[] = [];
  for (const time of timestamps) {
    const index = Math.floor((time - startTime) / 10);
    bins[index] = (bins[index] || 0) + 1;
  }
  return bins;
}

export const measureTime = async <T,>(
  label: string,
  func: () => Promise<T>,
  numOfReq: number = 1,
  numOfUsers: number = 1,
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
  const requestEndTimes: number[] = []; // För att lagra tidpunkter då varje request slutförs

  const promises = Array.from({ length: numOfReq }).map(async (_, i) => {
    const reqStart = performance.now();
    const result = await func();
    const reqEnd = performance.now();

    const duration = reqEnd - reqStart;
    results[i] = result;
    requestCount++;

    requestEndTimes.push(reqEnd); // Spara slutet av varje request

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
    numOfUsers: numOfUsers,
    totalTime: Number(totalTime.toFixed(2)),
    throughput: Number(throughput.toFixed(2)),
    avaregeResponseTime: Number(responseTime.toFixed(2)),
    requestsPer10ms: requestsPer10ms,
  };

  /*
  console.log(`\n--- [${label}] Performance Summary ---`);
  console.log(`Total requests sent       : ${metrics.numOfReq}`);
  console.log(`Total users               : ${metrics.numOfUsers}`);
  console.log(`Total test time           : ${metrics.totalTime} ms`);
  console.log(`Avg response time/request : ${metrics.avaregeResponseTime} ms`);
  console.log(`Throughput                : ${metrics.throughput} req/s`);
  console.log(
    `Requests per 10ms         : ${metrics.requestsPer10ms.join(", ")}`
  );
  console.log(`--- End of [${label}] ---\n`);
*/

  return { results, metrics, requestLogs };
};
