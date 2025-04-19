import { Product } from "../types/product"; // Se till att du importerar Product om det behövs

export const fetchProductsFromRest = async () => {
    const startTime = performance.now();
    const response = await fetch('http://localhost:3002/products');

    if (!response.ok) {
        throw new Error("Failed to fetch data from REST API");
    }


    const data: Product[] = await response.json(); // Se till att data är av typen Product[]
    const duration = Math.round(performance.now() - startTime);
    const requestSize = JSON.stringify(data).length; // Kan optimeras till content-length om tillgängligt

    return {
        apiType: 'REST',
        results: [{
            duration,
            success: true,
            timestamp: Date.now(),
            requestSize,
            apiType: 'REST'
        }],
        data: data, // Här returnerar vi själva produktdata
        stats: {
            average: duration,
            min: duration,
            max: duration,
            successRate: 1 // 100% successrate för denna gång
        }
    };
};

export const createProduct = async (productData: any) => {

};

export const updateProduct = async (id: string, productData: any) => {

};

export const deleteProduct = async (id: string) => {

};

export const restGetProducts = async () => {
    const startTime = performance.now();
    const response = await fetch('http://localhost:3002/products');
    const data: Product[] = await response.json();
    const duration = Math.round(performance.now() - startTime);
    const requestSize = JSON.stringify(data).length;
    return {
        apiType: 'REST',
        results: [{
            duration,
            success: true,
            timestamp: Date.now(),
            requestSize,
            apiType: 'REST'
        }],
        data: data,
        stats: {
            average: duration,
            min: duration,
            max: duration,
            successRate: 1
        }
    };
};

export const restPostProducts = async () => {
    const startTime = performance.now();
    const response = await fetch('http://localhost:3002/products');
}