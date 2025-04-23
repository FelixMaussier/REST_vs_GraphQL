import { faker } from "@faker-js/faker";
import { Category } from "../types/category"; // Importera Category-typen

type Product = {
  artikelnummer: string;
  namn: string;
  pris: number;
  lagerantal: number;
  vikt: number;
  kategoriID: number;
  beskrivning: string;
};

export const generateGraphPostProduct = async (
  numOfReq: number
): Promise<Product[]> => {
  const { categories, existingArtikelnr } =
    await fetchCategoriesAndArtikelnummer(numOfReq);

  if (!categories || categories.length === 0) {
    throw new Error("Inga kategorier hittades.");
  }

  const data: Product[] = [];
  const maxTries = numOfReq * 10;
  let tries = 0;

  while (data.length < numOfReq && tries < maxTries) {
    tries++;

    const artikelnummer = faker.string.uuid(); // Generera ett unikt artikelnummer

    // Kontrollera om artikelnumret redan finns i de genererade produkterna eller existerande artikelnummer
    if (
      existingArtikelnr.includes(artikelnummer) ||
      data.some((d) => d.artikelnummer === artikelnummer)
    ) {
      console.log(`Dublett hittad, försöker generera nytt artikelnummer...`);
      continue; // Skippar denna iteration om det är en dublett
    }

    const randomCategory = faker.helpers.arrayElement(categories);

    if (!randomCategory) {
      throw new Error("Kategori hittades inte.");
    }

    // Lägg till produkten i data-arrayen
    data.push({
      artikelnummer, // Använd det genererade artikelnumret
      namn: faker.commerce.productName(),
      pris: parseFloat(faker.commerce.price({ min: 10, max: 1000 })),
      lagerantal: faker.number.int({ min: 0, max: 1000 }),
      vikt: parseFloat(faker.number.float({ min: 0.1, max: 5 }).toFixed(2)),
      kategoriID: randomCategory.id, // Använd ID från den slumpmässigt valda kategorin
      beskrivning: faker.commerce.productDescription(),
    });
  }

  if (data.length < numOfReq) {
    throw new Error("Kunde inte generera tillräckligt många unika produkter.");
  }

  // Returnera endast de nygenererade produkterna
  return data;
};

const fetchCategoriesAndArtikelnummer = async (numOfReq: number) => {
  const response = await fetch("http://localhost:3001/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `
        query {
          getCategories(limit: ${numOfReq}) {
            id
            namn
          }
          getProducts {
            artikelnummer
          }
        }
      `,
    }),
  });

  const data = await response.json();
  console.log(data, "data");
  return {
    categories: data.data.getCategories as Category[],
    existingArtikelnr: data.data.getProducts.map((p: any) => p.artikelnummer),
  };
};
