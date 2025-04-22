import React from "react";
import { measureTime } from "../utils/measureResonseTime";

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

export const getProductsID = async (ID = 1, numOfUsers: number) => {
  return await measureTime(
    "REST /products/:id",
    async () => {
      const response = await fetch(base_url + "/products/" + ID);
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
export const postProducts = async (numOfUsers: number) => {
  return await measureTime(
    "REST /products",
    async () => {
      const body = {
        artikelnummer: "FRUKT" + Math.floor(Math.random() * 99999999),
        namn: "Hallon",
        pris: "12.00",
        lagerantal: 80,
        vikt: "10.99",
        kategori_id: 1,
        beskrivning: "En Hallom bär",
      };
      console.log("post rest_api");
      const response = await fetch(base_url + "/products/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      return data;
    },
    1,
    numOfUsers,
    "POST"
  );
};

//#endregion

//#region PUT
export const putProducts = async (ID = 1) => {
  const body = {
    id: ID,
    artikelnummer: "FRUKT00000000000",
    namn: "DruvorTEST",
    pris: "12.00",
    lagerantal: 80,
    vikt: "0.10",
    kategori_id: 1,
    beskrivning: "En klase druvor TEST",
  };
  const response = await fetch(base_url + "/products", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  return data;
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
