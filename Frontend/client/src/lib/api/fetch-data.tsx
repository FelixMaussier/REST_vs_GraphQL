export type ApiResponse = {
    duration: number;
    success: boolean;
    timestamp: number;
    requestSize?: number;
    apiType: 'REST' | 'GraphQL';
};

export type PerformanceResult = {
    apiType: 'REST' | 'GraphQL';
    results: ApiResponse[];
    stats: {
        average: number;
        min: number;
        max: number;
        successRate: number;
    };
};

/**
 * Measures API response time for REST or GraphQL endpoints
 * @param apiType - Type of API to test ('REST' or 'GraphQL')
 * @param numRequests - Number of requests to make (default: 20)
 * @param concurrency - Number of concurrent requests (default: 1)
 * @returns Performance results with statistics
 */
export async function measureResponseTime(
    apiType: 'REST' | 'GraphQL',
    numRequests: number = 20,
    concurrency: number = 1
): Promise<PerformanceResult> {
    const results: ApiResponse[] = [];
    const url = apiType === 'REST'
        ? "http://localhost:3002/getProducts"
        : "http://localhost:3001/";

    for (let i = 0; i < Math.ceil(numRequests / concurrency); i++) {
        const promises = Array(Math.min(concurrency, numRequests - i * concurrency))
            .fill(0)
            .map(async () => {
                const start = performance.now();
                try {
                    const res = await fetch(url, {
                        method: apiType === 'REST' ? 'GET' : 'POST',
                        headers: apiType === 'GraphQL'
                            ? { 'Content-Type': 'application/json' }
                            : undefined,
                        body: apiType === 'GraphQL'
                            ? JSON.stringify({
                                query: `
                                  query {
                                    getProducts {
                                      id
                                      namn
                                      pris
                                    }
                                  }
                                `
                            })
                            : undefined
                    });

                    const data = await res.json();

                    return {
                        duration: Math.round(performance.now() - start),
                        success: true,
                        timestamp: Date.now(),
                        requestSize: JSON.stringify(data).length,
                        apiType
                    };
                } catch (error) {
                    console.error(`Error in ${apiType} request:`, error);
                    return {
                        duration: Math.round(performance.now() - start),
                        success: false,
                        timestamp: Date.now(),
                        apiType
                    };
                }
            });

        const batchResults = await Promise.all(promises);
        results.push(...batchResults);

        // Add a small delay between batches to prevent overloading
        if (i < Math.ceil(numRequests / concurrency) - 1) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }

    // Calculate statistics
    const successfulResults = results.filter(r => r.success);
    const durations = successfulResults.map(r => r.duration);

    return {
        apiType,
        results,
        stats: {
            average: durations.length
                ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
                : 0,
            min: durations.length ? Math.min(...durations) : 0,
            max: durations.length ? Math.max(...durations) : 0,
            successRate: results.length ? successfulResults.length / results.length : 0
        }
    };
}