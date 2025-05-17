var responseTime = [];
var cpuArray = [];
var ramArray = [];

interface data {
  responseTime: number[];
  cpuArr: number[];
  ramArr: number[];
}
import { faker } from "@faker-js/faker";
import { fetchRestProductIds } from "./GetIDFromDB";

export const getProducts = async (iterations: number, numOfReq: number) => {
  var responseTime = [];
  var cpuArray = [];
  var ramArray = [];
  var sizeInBytes = [];

  for (let i = 0; i < iterations; i++) {
    const startTime = performance.now();
    const data = await fetch(
      `http://localhost:3002/products?limit=${numOfReq}`
    );
    const body = await data.text();
    const totalTime = performance.now() - startTime;
    responseTime.push(totalTime);
    cpuArray.push(data.headers.get("x-cpu"));
    ramArray.push(data.headers.get("x-ram"));

    const size = Buffer.byteLength(body, "utf8");
    const sizeInKB = size / 1024;
    sizeInBytes.push(sizeInKB);
    await sleep(300);
  }

  return {
    responseTime: responseTime,
    cpuArr: cpuArray,
    ramArr: ramArray,
    sizeInBytes: sizeInBytes,
  };
};

export const getProducts_3_tables = async (
  iterations: number,
  numOfReq: number
) => {
  var responseTime = [];
  var cpuArray = [];
  var ramArray = [];
  var sizeInBytes = [];

  for (let i = 0; i < iterations; i++) {
    const startTime = performance.now();
    const data = await fetch(
      `http://localhost:3002/products_3?limit=${numOfReq}`
    );
    const body = await data.text();
    const totalTime = performance.now() - startTime;
    responseTime.push(totalTime);
    cpuArray.push(data.headers.get("x-cpu"));
    ramArray.push(data.headers.get("x-ram"));

    const size = Buffer.byteLength(body, "utf8");
    const sizeInKB = size / 1024;
    sizeInBytes.push(sizeInKB);
    await sleep(300);
  }

  return {
    responseTime: responseTime,
    cpuArr: cpuArray,
    ramArr: ramArray,
    sizeInBytes: sizeInBytes,
  };
};

export const getProductsID = async (iterations: number, numOfReq: number) => {
  var responseTime = [];
  var cpuArray = [];
  var ramArray = [];
  var sizeInBytes = [];

  const validIDs = await fetchRestProductIds(numOfReq);

  const totalStartTime = performance.now();
  for (let i = 0; i < iterations; i++) {
    const id = validIDs[i];
    const startTime = performance.now();
    const data = await fetch(`http://localhost:3002/products/${id}`);
    const body = await data.text();
    const totalTime = performance.now() - startTime;
    responseTime.push(totalTime);
    cpuArray.push(data.headers.get("x-cpu"));
    ramArray.push(data.headers.get("x-ram"));

    const size = Buffer.byteLength(body, "utf8");
    const sizeInKB = size / 1024;
    sizeInBytes.push(sizeInKB);
    await sleep(300);
  }
  const totalDuration = performance.now() - totalStartTime;

  return {
    totalDuration: totalDuration,
    responseTime: responseTime,
    cpuArr: cpuArray,
    ramArr: ramArray,
    sizeInBytes: sizeInBytes,
  };
};

export const getProducts_2_fields = async (
  iterations: number,
  numOfReq: number
) => {
  const responseTime = [];
  const cpuArray = [];
  const ramArray = [];
  const sizeInBytes = [];

  const totalStartTime = performance.now();
  for (let i = 0; i < iterations; i++) {
    const startTime = performance.now();
    const data = await fetch(
      `http://localhost:3002/getProducts_2_fields?limit=${numOfReq}`
    );
    const totalTime = performance.now() - startTime;
    const body = await data.text();

    responseTime.push(totalTime);
    cpuArray.push(data.headers.get("x-cpu"));
    ramArray.push(data.headers.get("x-ram"));

    const size = Buffer.byteLength(body, "utf8");
    const sizeInKB = size / 1024;
    sizeInBytes.push(sizeInKB);
    await sleep(300);
  }

  const totalDuration = performance.now() - totalStartTime;

  return {
    totalDuration: totalDuration,
    responseTime: responseTime,
    cpuArr: cpuArray,
    ramArr: ramArray,
    sizeInBytes: sizeInBytes,
  };
};

export const postProducts = async (iterations: number, numOfReq: number) => {
  var responseTime = [];
  var cpuArray = [];
  var ramArray = [];
  var sizeInBytes = [];

  const totalStartTime = performance.now();
  for (let i = 0; i < iterations; i++) {
    const productData = await generateDataForProduct();
    const startTime = performance.now();
    const data = await fetch(`http://localhost:3002/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        artikelnummer: productData.artikelnummer,
        beskrivning: productData.beskrivning,
        kategori_id: productData.kategori_id,
        lagerantal: productData.lagerantal,
        namn: productData.namn,
        pris: productData.pris,
        vikt: productData.vikt,
      }),
    });

    const body = await data.text();
    const totalTime = performance.now() - startTime;
    responseTime.push(totalTime);
    cpuArray.push(data.headers.get("x-cpu"));
    ramArray.push(data.headers.get("x-ram"));

    const size = Buffer.byteLength(body, "utf8");
    const sizeInKB = size / 1024;
    sizeInBytes.push(sizeInKB);
    await sleep(300);
  }
  const totalDuration = performance.now() - totalStartTime;

  return {
    totalDuration: totalDuration,
    responseTime: responseTime,
    cpuArr: cpuArray,
    ramArr: ramArray,
    sizeInBytes: sizeInBytes,
  };
};

export const postProducts_3 = async (iterations: number, numOfReq: number) => {
  var responseTime = [];
  var cpuArray = [];
  var ramArray = [];
  var sizeInBytes = [];

  const totalStartTime = performance.now();
  for (let i = 0; i < iterations; i++) {
    const productData = await generateDataForProduct_3();
    const startTime = performance.now();
    const data = await fetch(`http://localhost:3002/products_3`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        artikelnummer: productData.artikelnummer,
        beskrivning: productData.beskrivning,
        kategori_id: productData.kategori_id,
        lagerantal: productData.lagerantal,
        namn: productData.namn,
        pris: productData.pris,
        vikt: productData.vikt,
        produkt_attribut: productData.produkt_attribut,
      }),
    });

    const body = await data.text();
    const totalTime = performance.now() - startTime;
    responseTime.push(totalTime);
    cpuArray.push(data.headers.get("x-cpu"));
    ramArray.push(data.headers.get("x-ram"));

    const size = Buffer.byteLength(body, "utf8");
    const sizeInKB = size / 1024;
    sizeInBytes.push(sizeInKB);
    await sleep(300);
  }
  const totalDuration = performance.now() - totalStartTime;

  return {
    totalDuration: totalDuration,
    responseTime: responseTime,
    cpuArr: cpuArray,
    ramArr: ramArray,
    sizeInBytes: sizeInBytes,
  };
};

export const putProduct = async (iterations: number, numOfReq: number) => {
  var responseTime = [];
  var cpuArray = [];
  var ramArray = [];
  var sizeInBytes = [];

  const totalStartTime = performance.now();
  for (let i = 0; i < iterations; i++) {
    try {
      const validIDs = await fetchRestProductIds(numOfReq);
      
      // Process each ID in the batch
      for (const id of validIDs) {
        const productData = await generateDataForPutProduct();
        const startTime = performance.now();
        const data = await fetch(`http://localhost:3002/products/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            artikelnummer: productData.artikelnummer,
            beskrivning: productData.beskrivning,
            kategori_id: productData.kategori_id,
            lagerantal: productData.lagerantal,
            namn: productData.namn,
            pris: productData.pris,
            vikt: productData.vikt,
            produkt_attribut: productData.produkt_attribut
          }),
        });

        const body = await data.text();
        const totalTime = performance.now() - startTime;
        responseTime.push(totalTime);
        cpuArray.push(data.headers.get("x-cpu"));
        ramArray.push(data.headers.get("x-ram"));

        const size = Buffer.byteLength(body, "utf8");
        const sizeInKB = size / 1024;
        sizeInBytes.push(sizeInKB);
        await sleep(300);
      }
    } catch (error) {
      console.error(`Error in iteration ${i + 1}:`, error);
    }
  }
  const totalDuration = performance.now() - totalStartTime;

  return {
    totalDuration: totalDuration,
    responseTime: responseTime,
    cpuArr: cpuArray,
    ramArr: ramArray,
    sizeInBytes: sizeInBytes,
  };
};

export const restDeleteProduct = async (iterations: number, numOfReq: number) => {
  const responseTime = [];
  const ramArray = [];
  const cpuArray = [];
  const sizeInBytes = [];

  const totalStartTime = performance.now();
  for (let i = 0; i < iterations; i++) {
    try {
      const validIDs = await fetchRestProductIds(numOfReq);
      
      const startTime = performance.now();
      
      const deletePromises = validIDs.map(id => 
        fetch(`http://localhost:3002/products/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          }
        })
      );

      const responses = await Promise.all(deletePromises);
      const bodies = await Promise.all(responses.map(res => res.text()));
      
      const totalTime = performance.now() - startTime;
      responseTime.push(totalTime);
      
      cpuArray.push(responses[0].headers.get("x-cpu"));
      ramArray.push(responses[0].headers.get("x-ram"));

      // Beräkna total storlek för alla svar
      const totalSize = bodies.reduce((acc, body) => acc + Buffer.byteLength(body, "utf8"), 0);
      const sizeInKB = totalSize / 1024;
      sizeInBytes.push(sizeInKB);
      
      await sleep(300);
    } catch (error) {
      console.error("Error during iteration:", error);
    }
  }

  const totalDuration = performance.now() - totalStartTime;
  const result = {
    totalDuration: totalDuration,
    responseTime: responseTime,
    cpuArr: cpuArray,
    ramArr: ramArray,
    sizeInBytes: sizeInBytes,
  };
  
  console.log("Returning result:", result);
  return result;
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

//#region DATA GENERATORS
const generateDataForProduct = async () => {
  const product = {
    artikelnummer: faker.string.uuid(),
    beskrivning: faker.commerce.productDescription(),
    kategori_id: faker.number.int({ min: 1, max: 50 }),
    lagerantal: faker.number.int({ min: 0, max: 100 }),
    namn: faker.commerce.productName(),
    pris: parseFloat(faker.commerce.price({ min: 10, max: 1000 })),
    vikt: faker.number.int({ min: 1, max: 5 }),
  };

  return product;
};

const generateDataForProduct_3 = async () => {
  const product = {
    artikelnummer: faker.string.uuid(),
    beskrivning: faker.commerce.productDescription(),
    kategori_id: faker.number.int({ min: 1, max: 50 }),
    lagerantal: faker.number.int({ min: 0, max: 100 }),
    namn: faker.commerce.productName(),
    pris: parseFloat(faker.commerce.price({ min: 10, max: 1000 })),
    vikt: faker.number.int({ min: 1, max: 5 }),

    produkt_attribut: [
      {
        attribut_namn: "Färg",
        attribut_varde: faker.color.human(),
      },
      {
        attribut_namn: "Storlek",
        attribut_varde: faker.helpers.arrayElement(["S", "M", "L", "XL"]),
      },
    ],
  };

  return product;
};

const generateDataForPutProduct = async () => {
  const product = {
    artikelnummer: faker.string.uuid(),
    beskrivning: faker.commerce.productDescription(),
    kategori_id: faker.number.int({ min: 1, max: 50 }),
    lagerantal: faker.number.int({ min: 0, max: 100 }),
    namn: faker.commerce.productName(),
    pris: parseFloat(faker.commerce.price({ min: 10, max: 1000 })),
    vikt: faker.number.int({ min: 1, max: 5 }),
    produkt_attribut: [
      {
        attribut_namn: "Färg",
        attribut_varde: faker.color.human(),
      },
      {
        attribut_namn: "Storlek",
        attribut_varde: faker.helpers.arrayElement(["S", "M", "L", "XL"]),
      },
      {
        attribut_namn: "Material",
        attribut_varde: faker.helpers.arrayElement([
          "Bomull",
          "Polyester",
          "Läder",
          "Trä",
        ]),
      },
    ],
  };

  return product;
};

//#endregion

