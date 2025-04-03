'use client';
import React, { useState, useEffect } from 'react';

type Product = {
    id: number;
    name: string;
    description: string;
    price: number;
};


export default function CardREST() {
    const [data, setData] = useState<Product[]>([]);
    const [loadingTime, setLoading] = useState(0);

    useEffect(() => {
        const timerStart = performance.now();
        fetch('http://localhost:3002')
            .then(response => response.json())
            .then((json: Product[]) => {
                setData(json);
                const timerEnd = performance.now();
                setLoading(timerEnd - timerStart);
            })
            .catch(error => console.error(error));
    }, []);

    return (
        <>
            <h1>Time for rest = {loadingTime}</h1>
            <div className="card-container">
                {data.map((product) => (
                    <div key={product.id} className="card">
                        <h2>{product.name}</h2>
                        <p>{product.description}</p>
                        <p>Price: ${product.price}</p>
                    </div>
                ))}
            </div>
        </>
    );
}

