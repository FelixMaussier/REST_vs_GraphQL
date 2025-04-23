import React from "react";
import { performance } from "perf_hooks";
import { generateGraphPostProduct } from "../utils/DataGenerator";
import { measureTime } from "@/app/utils/measureResonseTime";
import { da } from "@faker-js/faker";
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
    numOfReq,
    numOfUsers,
    "query: getProducts"
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

export const graphGetCategories = async (numOfReq: number) => {
  return await measureTime(
    "GraphQL getCategories",
    async () => {
      const response = await fetch("http://localhost:3001/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
                query {
                    getCategories(limit: ${numOfReq}) {
                        id
                        namn
                        beskrivning
                    }
                }
            `,
        }),
      });
      const data = await response.json();
      return data;
    },
    numOfReq,
    1,
    "query: getCategories"
  );
};
export const graphPostProduct = async (numOfReq: number) => {
  const products = await generateGraphPostProduct(numOfReq);
  console.log("Genererade produkter:", products.length);
  //console.log("products:::::::: ", products);
  const results = [];

  for (const [index, body] of products.entries()) {
    console.log(`Bearbetar produkt ${index + 1}/${products.length}`);
    const response = await fetch("http://localhost:3001/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          mutation postProduct($input: ProductInput!) {
            postProduct(input: $input) {
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
        variables: {
          input: {
            artikelnummer: body.artikelnummer,
            namn: body.namn,
            pris: body.pris,
            lagerantal: body.lagerantal,
            vikt: body.vikt,
            kategori_id: body.kategoriID,
            beskrivning: body.beskrivning,
          },
        },
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error("❌ Fel vid produkt:", body.artikelnummer);
      console.error("GraphQL Error:", JSON.stringify(data.errors, null, 2));
    } else {
      console.log("✅ Produkt skapad:", data.data.postProduct.artikelnummer);
    }
  }

  return;
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
