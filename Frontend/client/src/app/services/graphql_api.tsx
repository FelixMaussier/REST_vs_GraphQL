import React from "react";
import { performance } from "perf_hooks";
import { measureTime } from "@/app/utils/measureResonseTime";
//#region testCode
//#endregion

export const graphGetProducts = async (
  numOfReq: number,
  numOfUsers: number
) => {
  return await measureTime(
    "GraphQL getProducts",
    async () => {
      const response = await fetch("http://localhost:3001/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
                query {
                    getProducts(limit: ${numOfReq}) {
                        artikelnummer
                        beskrivning
                        id
                        kategori_id
                        lagerantal
                        namn
                        pris
                        vikt
                    }
                }
            `,
        }),
      });

      const data = await response.json();
      return data;
    },
    numOfUsers
  );
};

export const graphGetProductsById = async (ID = 1) => {
  const response = await fetch("http://localhost:3001/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `
                    query {
                        getProduct(id: ${ID}) {
                            artikelnummer
                            beskrivning
                            id
                            kategori_id
                            lagerantal
                            namn
                            pris
                            vikt
                        }
                    }
                `,
    }),
  });

  const data = await response.json();
  return data;
};

export const graphPostProduct = async () => {
  const body = {
    artikelnummer: "FRUKT" + Math.floor(Math.random() * 999999),
    namn: "Ny Hallom bär",
    pris: "12.00",
    lagerantal: 1000,
    vikt: "0.10",
    kategori_id: 1,
    beskrivning: "En Hallom bär",
  };

  const response = await fetch("http://localhost:3001/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `
                    mutation {
                        postProduct(input: {
                            artikelnummer: "${body.artikelnummer}",
                            namn: "${body.namn}",
                            pris: ${body.pris},
                            lagerantal: ${body.lagerantal},
                            vikt: ${body.vikt},
                            kategori_id: ${body.kategori_id},
                            beskrivning: "${body.beskrivning}"
                        }) {
                            artikelnummer
                            beskrivning
                            id
                            kategori_id
                            lagerantal
                            namn
                            pris
                            vikt
                        }
                    }
                `,
    }),
  });
  const data = await response.json();
  return data;
};

export const graphPutProduct = async (ID = 1) => {
  const body = {
    id: ID,
    artikelnummer: "FRUKT00000009999",
    namn: "Helt ny DruvorTEST",
    pris: "12.00",
    lagerantal: 80,
    vikt: "0.10",
    kategori_id: 1,
    beskrivning: "En klase druvor PUTTEST",
  };

  const response = await fetch("http://localhost:3001/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `
                    mutation {
                        putProduct(id: ${body.id}, input: {
                            artikelnummer: "${body.artikelnummer}",
                            namn: "${body.namn}",
                            pris: ${body.pris},
                            lagerantal: ${body.lagerantal},
                            vikt: ${body.vikt},
                            kategori_id: ${body.kategori_id},
                            beskrivning: "${body.beskrivning}"
                        }) {
                            artikelnummer
                            beskrivning
                            id
                            kategori_id
                            lagerantal
                            namn
                            pris
                            vikt
                        }
                    }
                `,
    }),
  });
  const data = await response.json();
  return data;
};

export const graphDeleteProduct = async (ID = -1) => {
  const response = await fetch("http://localhost:3001/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `
                        mutation {
                            deleteProduct(id: ${ID}) 
                        }
                    `,
    }),
  });
  const data = await response.json();
  return data;
};
