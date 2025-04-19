'use client';
type Product = {
    id: number;
    artikelnummer: string;
    namn: string;
    pris: number;
    lagerantal: number;
    vikt: number;
    kategoriID: string;
    beskrivning: string;
};
const graphQLFetchProductID = async (): Promise<Product[]> => {
    const response = await fetch("http://localhost:3001/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            query: `
            query {
              getProducts {
                name
                beskrivning
              }
            }
          `,
        }),
    });

    const result = await response.json();
    console.log("Resultat:", result.data.getProducts);
    return result.data.products;
};

export default graphQLFetchProductID;