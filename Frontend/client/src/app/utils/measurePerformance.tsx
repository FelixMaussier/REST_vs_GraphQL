import { ApiResponse } from "../types/apiResponse";
import { Product } from "../types/product";
export type PerformanceResult = {
    apiType: 'REST' | 'GraphQL';
    results: ApiResponse[];
    data: Product
    stats: {
        average: number;
        min: number;
        max: number;
        successRate: number;
    };
};