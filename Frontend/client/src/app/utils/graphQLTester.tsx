import {
  getProducts,
  getProductById,
  getProducts_3,
  postProduct,
  generateDataForProduct,
  generateDataForProduct_3,
  postProduct_3,
  getProducts_2_fields,
  putProduct,
  generateDataForPutProduct,
  deleteProduct,
} from "@/lib/api/GraphQLQueries";
import { fetchGraphQLProductIds } from "@/app/utils/GetIDFromDB";
import { da, faker } from "@faker-js/faker";

export const graphGetProducts = async (
  iterations: number,
  numOfReq: number
) => {
  const responseTime = [];
  const ramArray = [];
  const cpuArray = [];
  const sizeInBytes = [];

  for (let i = 0; i < iterations; i++) {
    const startTime = performance.now();

    try {
      const data = await getProducts(numOfReq);
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

export const graphGetProducts_3 = async (
  iterations: number,
  numOfReq: number
) => {
  var responseTime = [];
  var ramArray = [];
  var cpuArray = [];
  var sizeInBytes = [];

  for (let i = 0; i < iterations; i++) {
    const startTime = performance.now();

    try {
      const data = await getProducts_3(numOfReq);
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

export const graphGetProductsByID = async (
  iterations: number,
  numOfReq: number
) => {
  const responseTime = [];
  const ramArray = [];
  const cpuArray = [];
  const sizeInBytes = [];

  for (let i = 0; i < iterations; i++) {
    const validIDs = await fetchGraphQLProductIds(numOfReq);
    const startTime = performance.now();

    try {
      const responses = await Promise.all(
        validIDs.map(id => getProductById(id))
      );

      const totalTime = performance.now() - startTime;
      responseTime.push(totalTime);
      ramArray.push(responses[0].ram);
      cpuArray.push(responses[0].cpu);

      const totalSize = responses.reduce(
        (acc, response) => acc + Buffer.byteLength(JSON.stringify(response.data), "utf8"),
        0
      );
      sizeInBytes.push(totalSize / 1024);

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
      await sleep(300);
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

  for (let i = 0; i < iterations; i++) {
    const startTime = performance.now();

    try {
      const promises = [];
      for (let j = 0; j < numOfReq; j++) {
        const productData = await generateDataForProduct();
        promises.push(postProduct(productData));
      }

      const responses = await Promise.all(promises);
      const totalTime = performance.now() - startTime;

      responseTime.push(totalTime);
      cpuArray.push(responses[0].cpu);
      ramArray.push(responses[0].ram);

      const totalSize = responses.reduce(
        (acc, response) => acc + Buffer.byteLength(JSON.stringify(response.data), "utf8"),
        0
      );
      sizeInBytes.push(totalSize / 1024);

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

export const graphPostProduct_3 = async (
  iterations: number,
  numOfReq: number
) => {
  const responseTime = [];
  const ramArray = [];
  const cpuArray = [];
  const sizeInBytes = [];

  for (let i = 0; i < iterations; i++) {
    const startTime = performance.now();

    try {
      const promises = [];
      for (let j = 0; j < numOfReq; j++) {
        const productData = await generateDataForProduct_3();
        promises.push(postProduct_3(productData));
      }

      const responses = await Promise.all(promises);
      const totalTime = performance.now() - startTime;

      responseTime.push(totalTime);
      cpuArray.push(responses[0].cpu);
      ramArray.push(responses[0].ram);

      const totalSize = responses.reduce(
        (acc, response) => acc + Buffer.byteLength(JSON.stringify(response.data), "utf8"),
        0
      );
      sizeInBytes.push(totalSize / 1024);

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

export const graphPutProduct = async (iterations: number, numOfReq: number) => {
  const responseTime = [];
  const ramArray = [];
  const cpuArray = [];
  const sizeInBytes = [];

  for (let i = 0; i < iterations; i++) {
    const startTime = performance.now();

    try {
      const validIDs = await fetchGraphQLProductIds(numOfReq);
      const promises = [];

      for (const id of validIDs) {
        const productData = await generateDataForPutProduct();
        promises.push(putProduct(id, productData));
      }

      const responses = await Promise.all(promises);
      const totalTime = performance.now() - startTime;

      responseTime.push(totalTime);
      cpuArray.push(responses[0].cpu);
      ramArray.push(responses[0].ram);

      const totalSize = responses.reduce(
        (acc, response) => acc + Buffer.byteLength(JSON.stringify(response.data), "utf8"),
        0
      );
      sizeInBytes.push(totalSize / 1024);

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

export const graphDeleteProduct = async (
  iterations: number,
  numOfReq: number
) => {
  const responseTime = [];
  const ramArray = [];
  const cpuArray = [];
  const sizeInBytes = [];

  for (let i = 0; i < iterations; i++) {
    const startTime = performance.now();

    try {
      const validIDs = await fetchGraphQLProductIds(numOfReq);

      const deletePromises = validIDs.map(async (id) => {
        try {
          return await deleteProduct(id);
        } catch (error) {
          console.error(`Failed to delete product ${id}:`, error);
          return null;
        }
      });

      const responses = await Promise.all(deletePromises);
      const successfulResponses = responses.filter((r) => r !== null);

      if (successfulResponses.length === 0) {
        console.error("All delete operations failed in this iteration");
        continue;
      }

      const totalTime = performance.now() - startTime;
      responseTime.push(totalTime);

      cpuArray.push(successfulResponses[0].cpu);
      ramArray.push(successfulResponses[0].ram);

      const totalSize = successfulResponses.reduce(
        (acc, response) =>
          acc + Buffer.byteLength(JSON.stringify(response.data), "utf8"),
        0
      );
      sizeInBytes.push(totalSize / 1024);

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

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
