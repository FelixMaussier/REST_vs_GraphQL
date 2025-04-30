import React from "react";
import { measureTime } from "../utils/measureResonseTime";
import {
  fetchRestProductIds,
  fetchRestCategoryIds,
} from "../utils/GetIDFromDB";
import {
  generateProductData,
  generateUpdatedProductData,
} from "../utils/DataGenerator";
import { faker } from "@faker-js/faker";

const base_url = "http://localhost:3002";

//#region GET
export const getProducts = async (numOfReq: number, numOfUsers: number) => {
  return await measureTime(
    "REST /products",
    async () => {
      const response = await fetch(`${base_url}/products?limit=${numOfReq}`);
      const data = await response.json();
      return data;
    },
    numOfReq,
    numOfUsers,
    "GET"
  );
};

export const getProductsID = async (numOfUsers: number, numOfReq: number) => {
  const validIDs = await fetchRestProductIds(numOfReq);
  return await measureTime(
    "REST /products/:id",
    async () => {
      const responses = await Promise.all(
        validIDs.map(async (id) => {
          const response = await fetch(`${base_url}/products/${id}`);
          const data = await response.json();
          return data;
        })
      );
      return responses;
    },
    numOfReq,
    numOfUsers,
    "GET"
  );
};

//NOT IMPLEMENTED
export const getCategories = async (numOfReq: number, numOfUsers: number) => {
  return await measureTime(
    "REST /categories",
    async () => {
      const response = await fetch(`${base_url}/categories?limit=${numOfReq}`);
      const data = await response.json();
      return data;
    },
    numOfReq,
    numOfUsers,
    "GET"
  );
};

//NOT IMPLEMENTED
export const getCategoriesID = async (ID = 1, numOfUsers: number) => {
  return await measureTime(
    "REST /categories/:id",
    async () => {
      const response = await fetch(base_url + "/categories/" + ID);
      const data = await response.json();
      return data;
    },
    1,
    numOfUsers,
    "GET"
  );
};
//#endregion

//#region POST
export const postProducts = async (numOfUsers: number, numOfReq: number) => {
  const generatedProducts = generateProductData(numOfReq);
  console.log("numOfReq:", numOfReq);
  console.log("Antal genererade produkter:", generatedProducts.length);

  const createSingleProduct = async () => {
    const randomIndex = Math.floor(Math.random() * generatedProducts.length);
    const product = generatedProducts[randomIndex];
    const response = await fetch(base_url + "/products/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    });

    const data = await response.json();
    return data;
  };
  return await measureTime(
    "REST /products",
    createSingleProduct,
    numOfReq,
    numOfUsers,
    "POST"
  );
};

//#endregion

//#region PUT
export const putProducts = async (numOfUsers: number, numOfReq: number) => {
  const productIds = await fetchRestProductIds(numOfReq);
  const categorieID = await fetchRestCategoryIds(numOfReq);

  console.log("productIds", productIds);
  console.log("categorieID", categorieID);

  const updatedProducts = generateUpdatedProductData(productIds, categorieID);

  const updateSingleProduct = async (product: any) => {
    const response = await fetch(`${base_url}/products`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    });

    if (!response.ok) {
      throw new Error(`Failed to update product ${product.id}`);
    }

    return await response.json();
  };

  try {
    const { results, metrics, requestLogs } = await measureTime(
      "REST /products",
      async () => {
        const updateRequests = updatedProducts.map(async (product) => {
          try {
            await updateSingleProduct(product);
          } catch (error) {
            console.error(
              `Error updating product with ID ${product.id}:`,
              error
            );
            return null;
          }
        });

        await Promise.all(updateRequests);
      },
      numOfReq,
      numOfUsers,
      "PUT"
    );

    console.log("Successfully updated products:", results);
    console.log("Metrics data:", metrics);
    console.log("Request logs:", requestLogs);

    // Returnera results och metrics till anropande funktion
    return { results, metrics };
  } catch (error) {
    console.error("Error updating products:", error);
    // Returnera tomma resultat och metrics om ett fel inträffar
    return { results: [], metrics: {} };
  }
};

//#endregion

//#region DELETE

export const deleteProducts = async (ID = -1) => {
  const response = await fetch(base_url + "/products/" + ID, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log("rest_api Delete");

  const data = await response.json();
  return data;
};

//#endregion
