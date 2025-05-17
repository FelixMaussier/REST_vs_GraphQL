import { GraphQLClient } from 'graphql-request';

import { faker, Faker } from "@faker-js/faker";
const endpoint = "http://localhost:3001/graphql";


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
        beskrivning
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
          kategori{
            namn
            beskrivning
          }
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

  export const getProducts_2_fields = async (limit: number) => {
    const query = `
      query getProducts($limit: Int) {
        getProducts(limit: $limit) {
          namn
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
  }



export const postProduct = async (product: any) => { 
  const query = `
  mutation postProduct($input: ProduktInput!) {
    postProduct(input: $input) {
      artikelnummer
      beskrivning
      id
      kategori {
        namn
      }
      lagerantal
      id
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
      variables: { input: product },
    }),
  });

  const data = await response.json();
    return {
      data: data.data,
      cpu: response.headers.get("x-cpu"),
      ram: response.headers.get("x-ram"),
    };
}


export const postProduct_3 = async (product: any) => {
  const query = `
  mutation postProduct_3($input: ProduktInput!) {
    postProduct_3(input: $input) {
      id
      artikelnummer
      namn
      pris
      lagerantal
      vikt
      beskrivning
      kategori {
        id
        namn
        beskrivning
      }
      attributer {
        id
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
    variables: { input: product },
  }),
});


  const data = await response.json();
  
  return {
    data: data.data,
    cpu: response.headers.get("x-cpu"),
    ram: response.headers.get("x-ram"),
  };

}


export const putProduct = async (id: any, product: any)=> {
  const query = `
  mutation putProduct($id: ID!, $input: ProduktInput!) {
    putProduct(id: $id, input: $input) {
      id
      artikelnummer
      namn
      pris
      lagerantal
      vikt
      beskrivning
      kategori {
        id
        namn
        beskrivning
      }
      attributer {
        id
        attribut_namn
        attribut_varde
      }
    }
  }
  `;

  const variables = { 
    id: id,
    input: product 
  };

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const data = await response.json();
  return {
    data: data.data,
    cpu: response.headers.get("x-cpu"),
    ram: response.headers.get("x-ram"),
  };
}

export const deleteProduct = async (id: any) => {
  const query = `
  mutation deleteProduct($id: ID!) {
    deleteProduct(id: $id)
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
  
  if (data.errors) {
    console.error("GraphQL errors:", data.errors);
    throw new Error(data.errors[0].message);
  }

  return {
    data: data.data,
    cpu: response.headers.get("x-cpu"),
    ram: response.headers.get("x-ram"),
  };
}

export const generateDataForProduct = async ()=> {
  const product = {
    artikelnummer: faker.string.uuid(),
    beskrivning: faker.commerce.productDescription(),
    kategori_id: faker.number.int({ min: 1, max: 50 }),
    lagerantal: faker.number.int({ min: 0, max: 100 }),
    namn: faker.commerce.productName(),
    pris: parseFloat(faker.commerce.price({ min: 10, max: 1000 })),
    vikt: faker.number.int({ min: 1, max: 5 }) 
  };

  return product;
}

export const generateDataForProduct_3 = async () => {
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
  }

  return product;
  
}

export const generateDataForPutProduct = async () => {
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
        attribut_varde: faker.helpers.arrayElement(["Bomull", "Polyester", "Läder", "Trä"]),
      }
    ],
  };

  return product;
};