'use client';
import React, { useState, useEffect } from 'react';

type Product = {
    id: number;
    name: string;
    description: string;
    price: number;
};

type Kategori = {
    name: string;
    beskrivning: string;
}

export default function CardREST() {
    //const [data, setData] = useState<Product[]>([]);
    const [loadingTime, setLoading] = useState(0);
    const [data, setData] = useState<Kategori[]>([]);

    useEffect(() => {
        const timerStart = performance.now();
        fetch('http://localhost:3002')
            .then(response => response.json())
            .then((json: Kategori[]) => {
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
                {data.map((Kategori) => (
                    <div key={Kategori.name}>
                        <p>{Kategori.beskrivning}</p>
                    </div>
                ))}
            </div>
        </>
    );
}

