export type ApiResponse = {
    
    duration: number;
    success: boolean;
    timestamp: number;
    requestSize?: number;
    apiType: 'REST' | 'GraphQL';  // strikt typ
};

export type PerformanceResult = {
    apiType: 'REST' | 'GraphQL';  // strikt typ
    results: ApiResponse[];
    stats: {
        average: number;
        min: number;
        max: number;
        successRate: number;
    };
};