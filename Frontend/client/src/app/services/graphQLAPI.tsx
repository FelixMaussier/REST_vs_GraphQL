'use client'
import { Product } from "../types/product";
export const fetchProductsFromGraphQL = async () => {
    const startTime = performance.now();
    const response = await fetch("http://localhost:3001/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            query: `
                query {
                    getProducts {
                        id
                        namn
                        pris
                    }
                }
            `
        }),
    });

    const data: Product[] = await response.json();
    // Läs hela svaret som JSON
    const responseBody = await response.json();  // Läs bara en gång, utan att försöka läsa body igen
    console.log("Full Response:", responseBody);

    // Extrahera produkterna och logga dem
    const products = responseBody?.data?.getProducts || [];
    console.log("Fetched Products:", products);

    // Om det finns produkter, logga varje produkt med namn och pris
    products.forEach((product: Product) => {
        console.log(`Produkt: ${product.namn}, Pris: ${product.pris}`);
    });
    const duration = Math.round(performance.now() - startTime);

    return {
        apiType: 'GraphQL',
        results: [{
            duration,
            success: true,
            timestamp: Date.now(),
            requestSize:
                data.length,
            apiType: 'GraphQL'
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