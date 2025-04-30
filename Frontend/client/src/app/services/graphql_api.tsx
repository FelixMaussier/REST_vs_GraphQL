import React from "react";
import { performance } from "perf_hooks";
import { measureTime } from "@/app/utils/measureResonseTime";
import { da } from "@faker-js/faker";
import {
  fetchGraphQLProductIds,
  fetchGraphQLCategoryIds,
} from "../utils/GetIDFromDB";
import {
  generateProductData,
  generateUpdatedProductData,
} from "../utils/DataGenerator";
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

export const graphGetProductsById = async (
  numOfUsers: number,
  numOfReq: number
) => {
  const validIDs = await fetchGraphQLProductIds(numOfReq);

  return await measureTime(
    "GraphQL getProduct(id:)",
    async () => {
      const responses = await Promise.all(
        validIDs.map(async (id) => {
          const response = await fetch("http://localhost:3001/graphql", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              query: `
                query {
                  getProduct(id: ${id}) {
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
          return data.data.getProduct;
        })
      );
      return responses;
    },
    numOfReq,
    numOfUsers,
    "POST"
  );
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

export const graphPostProduct = async (
  numOfUsers: number,
  numOfReq: number
) => {
  const products = generateProductData(numOfReq);
  console.log("numOfReq:", numOfReq);
  console.log("Antal genererade produkter:", products.length);

  const createSingleProduct = async () => {
    const randomIndex = Math.floor(Math.random() * products.length);
    const body = products[randomIndex];

    const response = await fetch("http://localhost:3001/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          mutation postProduct($input: ProduktInput!) {
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
            kategori_id: body.kategori_id,
            beskrivning: body.beskrivning,
          },
        },
      }),
    });

    const data = await response.json();
    console.log("metic data: ", data.data);
    return data;
  };

  return await measureTime(
    "GraphQL POST /products",
    createSingleProduct,
    numOfReq,
    numOfUsers,
    "POST"
  );
};

export const graphPutProduct = async (numOfUsers: number, numOfReq: number) => {
  const productIds = await fetchGraphQLProductIds(numOfReq);
  const categoryIDs = await fetchGraphQLCategoryIds(numOfReq);
  const productData = generateUpdatedProductData(productIds, categoryIDs);

  console.log("productIds", productIds);
  console.log("categoryIDs", categoryIDs);
  console.log("productData", productData);

  const testProdukt = productData[0];

  const mutation = `
    mutation UpdateProduct($id: Int!, $input: ProduktInput!) {
      putProduct(id: $id, input: $input) {
        artikelnummer
        namn
        pris
        lagerantal
        vikt
        kategori_id
        beskrivning
        produktAttribut {
          attribut_namn
          attribut_varde
        }
      }
    }
  `;

  const variables = {
    id: Number(testProdukt.id),
    input: {
      artikelnummer: testProdukt.artikelnummer,
      namn: testProdukt.namn,
      pris: Number(testProdukt.pris),
      lagerantal: Number(testProdukt.lagerantal),
      vikt: testProdukt.vikt,
      kategori_id: Number(testProdukt.kategori_id),
      beskrivning: testProdukt.beskrivning,
      attribut: [
        {
          namn: "default", // Required field for ProduktAttributInput
          varde: "default", // Required field for ProduktAttributInput
        },
      ],
    },
  };

  const response = await fetch("http://localhost:3001/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: mutation,
      variables: variables,
    }),
  });

  const result = await response.json();
  if (result.errors) {
    console.error("❌ GraphQL error:", result.errors);
  } else {
    console.log("✅ Produkt uppdaterad:", result.data.putProduct);
  }
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
