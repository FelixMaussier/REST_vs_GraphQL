import { useState } from "react";

const usePerformanceTest = () => {
  const [results, setResults] = useState({
    gql: { times: [], cpu: [], ram: [] },
    rest: { times: [], cpu: [], ram: [] },
  });
  const [isTesting, setIsTesting] = useState(false);

  const runTest = async (testFunction, iterations) => {
    setIsTesting(true);
    const testResults = { times: [], cpu: [], ram: [] };

    for (let i = 0; i < iterations; i++) {
      const startTime = performance.now();
      const startCpu = process.cpuUsage(); // Node-specifikt, anpassa för frontend
      const startMem = performance.memory.usedJSHeapSize; // Webbläsar-API

      await testFunction(); // Kör t.ex. en GraphQL-query

      const endTime = performance.now();
      const endCpu = process.cpuUsage(startCpu);
      const endMem = performance.memory.usedJSHeapSize;

      testResults.times.push(endTime - startTime);
      testResults.cpu.push(endCpu.user);
      testResults.ram.push((endMem - startMem) / 1024 / 1024); // MB
    }

    setResults((prev) => ({ ...prev, gql: testResults }));
    setIsTesting(false);
  };

  return { results, isTesting, runTest };
};

export default usePerformanceTest;
