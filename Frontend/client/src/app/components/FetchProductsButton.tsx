'use client'
import { useState } from 'react';
import { fetchProductsFromRest } from '@/app/services/restAPI';
import { fetchProductsFromGraphQL } from '../services/graphQLAPI';
import { PerformanceResult } from '@/app/utils/measurePerformance';
import { Button } from '@/components/ui/button';

const FetchProductsButton = () => {
    const [restPerformance, setRestPerformance] = useState<PerformanceResult | null>(null);
    const [graphqlPerformance, setGraphqlPerformance] = useState<PerformanceResult | null>(null);
    const [restProductCount, setRestProductCount] = useState<number>(0);
    const [graphqlProductCount, setGraphqlProductCount] = useState<number>(0);

    const handleRestClick = async () => {
        const performance = await fetchProductsFromRest();
        performance.data.forEach((product) => {
            console.log("Produkt Namn: " + product.namn);  // Här skriver vi ut produktens namn
        });
        const count = performance.data.length;
        setRestProductCount(count);
        console.log("Antal produkter: ", restProductCount);
    };

    const handleGraphQLClick = async () => {
        console.log("knapp klickades")
        const performance = await fetchProductsFromGraphQL();
        setGraphqlProductCount(performance.data.length);
        console.log("Antal produkter: " + graphqlProductCount);
    };

    return (
        <div>
            <Button onClick={handleRestClick}>Testa REST</Button>
            <Button onClick={handleGraphQLClick}>Testa GraphQL</Button>

            {restPerformance && (
                <div>
                    <h2>REST Performance</h2>
                    <p>Average Time: {restPerformance.stats.average} ms</p>
                    <p>Success Rate: {restPerformance.stats.successRate}</p>
                </div>
            )}

            {graphqlPerformance && (
                <div>
                    <h2>GraphQL Performance</h2>
                    <p>Average Time: {graphqlPerformance.stats.average} ms</p>
                    <p>Success Rate: {graphqlPerformance.stats.successRate}</p>
                </div>
            )}
        </div>
    );
};

export default FetchProductsButton;