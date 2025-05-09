import { da } from "@faker-js/faker";

const rest_url = "http://localhost:3002";
const graph_url = "http://localhost:3001/graphql";

//#region  REST API
export const fetchRestProductIds = async (
  numOfReq: number
): Promise<number[]> => {
  const response = await fetch(`${rest_url}/getRandomID?limit=${numOfReq}`);
  const data = await response.json();

  return data;
};

export const fetchRestCategoryIds = async (
  numOfReq: number
): Promise<number[]> => {
  const response = await fetch(
    `${rest_url}/getRandomCategoryID?limit=${numOfReq}`
  );
  const data = await response.json();
  return data;
};

//#endregion

//#region GraphQL API
export const fetchGraphQLProductIds = async (
  numOfReq: number
): Promise<number[]> => {
  const response = await fetch(`${graph_url}/graphql`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `
          query {
            getRandomProductID(limit: ${numOfReq})
          }
        `,
    }),
  });

  const data = await response.json();
  return data.data.getRandomProductID;
};

export const fetchGraphQLCategoryIds = async (
  numOfReq: number
): Promise<number[]> => {
  const response = await fetch(`${graph_url}/graphql`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `
          query {
            getCategories(limit: ${numOfReq}) {
              id
            }
          }
        `,
    }),
  });

  const data = await response.json();
  return data.data.getCategories.map((category: any) => category.id);
};

//#endregion
