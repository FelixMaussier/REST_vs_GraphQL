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
    numOfUsers
  );
};

export const getProductsID = async (ID = 1) => {
  const response = await fetch(base_url + "/products/" + ID);
  const data = await response.json();
  //   console.log("Svarstid (ms):", data.rest_avg);
  //   console.log("CPU-tid (µs):", data.cpu_time);
  //   console.log("Minnesdiff (MB):", data.memory_diff);
  //   console.log("Antal requests:", data.number_of_req);
  //   console.log("Antal användare:", data.number_of_user);
  //   console.log("Produkter:", data.data);
  return data;
};
//#endregion

//#region POST
export const postProducts = async () => {
  const body = {
    artikelnummer: "FRUKT" + Math.floor(Math.random() * 999999),
    namn: "Hallon",
    pris: "12.00",
    lagerantal: 80,
    vikt: "10.99",
    kategori_id: 1,
    beskrivning: "En Hallom bär",
  };
  const response = await fetch(base_url + "/products/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  return data;
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
