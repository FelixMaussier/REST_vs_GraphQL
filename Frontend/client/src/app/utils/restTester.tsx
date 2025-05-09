var responseTime = [];
var cpuArray = [];
var ramArray = [];

interface data {
  responseTime: number[];
  cpuArr: number[];
  ramArr: number[];
}
import { faker, Faker } from "@faker-js/faker";
import { fetchRestProductIds } from "./GetIDFromDB";

export const getProducts = async (numOfReq: number, iterations: number) => {
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
  }

  return {
    responseTime: responseTime,
    cpuArr: cpuArray,
    ramArr: ramArray,
    sizeInBytes: sizeInBytes,
  };
};

export const getProducts_3_tables = async (
  numOfReq: number,
  iterations: number
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
  }

  return {
    responseTime: responseTime,
    cpuArr: cpuArray,
    ramArr: ramArray,
    sizeInBytes: sizeInBytes,
  };
};

export const getProductsID = async (numOfReq: number) => {
  var responseTime = [];
  var cpuArray = [];
  var ramArray = [];
  var sizeInBytes = [];

  const validIDs = await fetchRestProductIds(numOfReq);

  const totalStartTime = performance.now();
  for (let i = 0; i < numOfReq; i++) {
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
