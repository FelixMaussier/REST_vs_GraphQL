"use client";

import React from "react";
import { useState, useEffect } from "react";

type Kategori = {
    name: string;
    beskrivning: string;
}


export default function CardGraphQL() {
    const [loadingTime, setLoading] = useState(0);
    const [data, setData] = useState<Kategori[]>([]);
    useEffect(() => {
        const timerStart = performance.now();
        fetch('http://localhost:3001/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: `
                query {
                  kategorier {
                    name
                    beskrivning
                  }
                }
              `,
            }),
        })
            .then(res => res.json())
            .then(data => {
                setData(data.data.kategorier);
                setLoading(performance.now() - timerStart);
            })
            .catch(error => console.error(error));
    }, []);
    return (
        <>
            <h1>Time for GraphQL</h1>
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