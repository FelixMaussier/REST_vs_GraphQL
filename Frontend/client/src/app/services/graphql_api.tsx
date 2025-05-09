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
import { usePerformance } from "@/hooks/usePerfomance";
//#region testCode
//#endregion
/*
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
    "query: getProducts"
  );
};

*/
export const graphGetProducts = async (numOfReq: number) => {
  console.log("numOfReq:", numOfReq);
  const query = `
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
    }
  `;
  const metrict = usePerformance("http://localhost:3001", query);

  console.log("Latency:", metrict[0]);
  console.log("Throughput:", metrict[1]);
  console.log("Error:", metrict[2]);
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
    "query: getCategories"
  );
};

export const graphPostProduct = async (numOfReq: number) => {
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
    "POST"
  );
};

export const graphPutProduct = async (numOfReq: number) => {
  const productIds = await fetchGraphQLProductIds(numOfReq);
  const categoryIDs = await fetchGraphQLCategoryIds(numOfReq);
  const productData = generateUpdatedProductData(productIds, categoryIDs);

  console.log("productIds", productIds);
  console.log("categoryIDs", categoryIDs);
  console.log("productData", productData);

  const { results, metrics, requestLogs } = await measureTime(
    "GraphQL PUT /products",
    async () => {
      const updateRequests = productData.map(async (product) => {
        try {
          const response = await fetch("http://localhost:3001/graphql", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              query: `
                mutation putProduct($id: ID!, $input: ProduktInput!) {
                  putProduct(id: $id, input: $input) {
                    artikelnummer
                    namn
                    pris
                    lagerantal
                    vikt
                    kategori_id
                    beskrivning
                  }
                }
              `,
              variables: {
                id: Number(product.id),
                input: {
                  artikelnummer: product.artikelnummer,
                  namn: product.namn,
                  pris: Number(product.pris),
                  lagerantal: Number(product.lagerantal),
                  vikt: Number(product.vikt),
                  kategori_id: Number(product.kategori_id),
                  beskrivning: product.beskrivning,
                },
              },
            }),
          });

          const data = await response.json();
          console.log(`Updated product ${product.id}`, data);
          return data;
        } catch (error) {
          console.error(`Error updating product ${product.id}:`, error);
          return null;
        }
      });

      await Promise.all(updateRequests);
    },
    numOfReq,

    "PUT"
  );

  console.log("Metrics data:", metrics);
  return { results, metrics };
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
