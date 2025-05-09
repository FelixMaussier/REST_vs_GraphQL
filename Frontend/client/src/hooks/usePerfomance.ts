import { useState, useEffect } from 'react';

export const usePerformance = (url: string, query: string) => {
  const [latency, setLatency] = useState<number | null>(null);
  const [throughput, setThroughput] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const startTime = Date.now();

    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    })
      .then((res) => res.json())
      .then((data) => {
        const latency = Date.now() - startTime;
        const throughput = 1;
        setLatency(latency);
        setThroughput(throughput);
      })
      .catch((error) => setError(error.message));
  }, [url, query]);

  // Returnera en array istället för ett objekt
  return [latency, throughput, error];
};