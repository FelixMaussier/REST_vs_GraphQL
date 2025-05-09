import { ur } from "@faker-js/faker";
import { GraphQLClient } from 'graphql-request';

const faker = require("@faker-js/faker");
const endpoint = "http://localhost:3001/graphql";
const graphQLClient = new GraphQLClient(endpoint, {
    headers: {
      "Content-Type": "application/json",
    },
});


export const getProducts = async (limit: number) => {
    const query = `
      query getProducts($limit: Int) {
        getProducts(limit: $limit) {
          id
          artikelnummer
          namn
          pris
          lagerantal
          vikt
          beskrivning
          
        }
      }
    `;
  
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables: { limit },
      })
    });

    const data = await response.json();

    return {
        data: data.data,
        cpu: response.headers.get("x-cpu"),
        ram: response.headers.get("x-ram"),
      };
  };


export const getProducts_3 = async (limit: number) => {
  const query = `
  query getProducts_3($limit: Int) {
    getProducts_3(limit: $limit) {
      id
      namn
      pris
      artikelnummer
      kategori {
        namn
      }
      attributer {
        attribut_namn
        attribut_varde
      }
    }
  }
  `;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables: { limit },
    })
  });

  const data = await response.json();

  console.log("data TESTSSS", data);
    return {
        data: data.data,
        cpu: response.headers.get("x-cpu"),
        ram: response.headers.get("x-ram"),
      };
}









  export const getProductById = async (id: number) => {
    const query = `
      query getProduct($id: ID!) {
        getProduct(id: $id) {
          artikelnummer
          beskrivning
          id
          kategori
          lagerantal
          namn
          pris
          vikt
        }
      }
    `;
  
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables: { id },
      }),
    });
  
    const data = await response.json();
    return {
      data: data.data,
      cpu: response.headers.get("x-cpu"),
      ram: response.headers.get("x-ram"),
    };
  };



export const graphPostProduct = (product: any) => {
    return `mutation {
        postProduct(
            artikelnummer: "${product.artikelnummer}",
            namn: "${product.namn}",
            pris: ${product.pris},
            lagerantal: ${product.lagerantal},
            vikt: ${product.vikt},
            kategori_id: ${product.kategori_id},
            beskrivning: "${product.beskrivning}"
        ) {
            artikelnummer
            beskrivning
            id
            kategori_id
            lagerantal
            namn
            pris
            vikt
        }
    }`;
}