import {
  getProducts,
  getProductById,
  getProducts_3,
  postProduct,
  generateDataForProduct,
  generateDataForProduct_3,
  postProduct_3,
  getProducts_2_fields,
} from "@/lib/api/GraphQLQueries";
import { fetchGraphQLProductIds } from "@/app/utils/GetIDFromDB";
import { da, faker } from "@faker-js/faker";
import { number } from "zod";

var responseTime = [];
var cpuArray = [];
var ramArray = [];
var sizeInBytes = [];

export const graphGetProducts = async (iterations: number, limit: number) => {
  const responseTime = [];
  const ramArray = [];
  const cpuArray = [];
  const sizeInBytes = [];

  for (let i = 0; i < iterations; i++) {
    const startTime = performance.now();

    try {
      const data = await getProducts(limit);
      const totalTime = performance.now() - startTime;

      ramArray.push(data.ram);
      cpuArray.push(data.cpu);
      responseTime.push(totalTime);

      const responseBody = JSON.stringify(data.data);

      const size = Buffer.byteLength(responseBody, "utf8");
      const sizeInKB = size / 1024;
      sizeInBytes.push(sizeInKB);
    } catch (error) {
      console.error("Error during iteration:", error);
    }
  }
  return {
    responseTime: responseTime,
    cpuArr: cpuArray,
    ramArr: ramArray,
    sizeInBytes: sizeInBytes,
  };
};

export const graphGetProducts_3 = async (
  numOfReq: number,
  iterations: number
) => {
  const responseTime = [];
  const ramArray = [];
  const cpuArray = [];
  const sizeInBytes = [];

  for (let i = 0; i < iterations; i++) {
    const startTime = performance.now();

    try {
      const data = await getProducts_3(numOfReq);
      console.log("data:: ", data);
      const totalTime = performance.now() - startTime;

      ramArray.push(data.ram);
      cpuArray.push(data.cpu);
      responseTime.push(totalTime);

      const responseBody = JSON.stringify(data.data);

      const size = Buffer.byteLength(responseBody, "utf8");
      const sizeInKB = size / 1024;
      sizeInBytes.push(sizeInKB);

      await sleep(300);
    } catch (error) {
      console.error("Error during iteration:", error);
    }
  }
  return {
    responseTime: responseTime,
    cpuArr: cpuArray,
    ramArr: ramArray,
    sizeInBytes: sizeInBytes,
  };
};

export const graphGetProductsByID = async (numOfReq: number) => {
  const responseTime = [];
  const ramArray = [];
  const cpuArray = [];
  const sizeInBytes = [];

  const validIDs = await fetchGraphQLProductIds(numOfReq);

  const totalStartTime = performance.now();
  for (let i = 0; i < numOfReq; i++) {
    try {
      const id = validIDs[i];
      const startTime = performance.now();
      const data = await getProductById(id);

      const totalTime = performance.now() - startTime;

      responseTime.push(totalTime);
      cpuArray.push(data.cpu);
      ramArray.push(data.ram);

      const responseBody = JSON.stringify(data.data);

      const size = Buffer.byteLength(responseBody, "utf8");
      const sizeInKB = size / 1024;
      sizeInBytes.push(sizeInKB);
    } catch (error) {
      console.error("Error during iteration:", error);
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

export const graph_getProducts_2_fields = async (
  iterations: number,
  numOfReq: number
) => {
  const responseTime = [];
  const ramArray = [];
  const cpuArray = [];
  const sizeInBytes = [];

  const totalStartTime = performance.now();

  for (let i = 0; i < iterations; i++) {
    const startTime = performance.now();

    try {
      const data = await getProducts_2_fields(numOfReq);
      const totalTime = performance.now() - startTime;

      ramArray.push(data.ram);
      cpuArray.push(data.cpu);
      responseTime.push(totalTime);

      const responseBody = JSON.stringify(data.data);
      const size = Buffer.byteLength(responseBody, "utf8");
      const sizeInKB = size / 1024;
      sizeInBytes.push(sizeInKB);
    } catch (error) {
      console.error("Error during iteration:", error);
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

export const graphPostProduct = async (
  iterations: number,
  numOfReq: number
) => {
  const responseTime = [];
  const ramArray = [];
  const cpuArray = [];
  const sizeInBytes = [];

  const totalStartTime = performance.now();
  for (let i = 0; i < numOfReq; i++) {
    try {
      const productData = await generateDataForProduct();
      const startTime = performance.now();
      const data = await postProduct(productData);

      console.log("data: teste:  ", data);
      const totalTime = performance.now() - startTime;

      responseTime.push(totalTime);
      cpuArray.push(data.cpu);
      ramArray.push(data.ram);

      const responseBody = JSON.stringify(data.data);

      const size = Buffer.byteLength(responseBody, "utf8");
      const sizeInKB = size / 1024;
      sizeInBytes.push(sizeInKB);
    } catch (error) {
      console.error("Error during iteration:", error);
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

export const graphPostProduct_3 = async (iterations: number) => {
  const responseTime = [];
  const ramArray = [];
  const cpuArray = [];
  const sizeInBytes = [];

  const totalStartTime = performance.now();
  for (let i = 0; i < iterations; i++) {
    try {
      const productData = await generateDataForProduct_3();
      const startTime = performance.now();
      const data = await postProduct_3(productData);

      const totalTime = performance.now() - startTime;

      responseTime.push(totalTime);
      cpuArray.push(data.cpu);
      ramArray.push(data.ram);

      const responseBody = JSON.stringify(data.data);

      const size = Buffer.byteLength(responseBody, "utf8");
      const sizeInKB = size / 1024;
      sizeInBytes.push(sizeInKB);
    } catch (error) {
      console.error("Error during iteration:", error);
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

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
