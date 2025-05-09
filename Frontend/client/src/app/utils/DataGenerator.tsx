import { faker } from "@faker-js/faker";
import { Category } from "../types/category";
import { Kategori } from "../types/DatabaseTypes";
import { Produkt } from "../types/DatabaseTypes";
import { ProduktAttribut } from "../types/DatabaseTypes";

type Product = {
  artikelnummer: string;
  namn: string;
  pris: number;
  lagerantal: number;
  vikt: number;
  kategori_id: number;
  beskrivning: string;
};

export const generateProductData = (numOfReq: number): Product[] => {
  const generatedProducts: Product[] = [];

  for (let i = 0; i < numOfReq; i++) {
    const artikelnummer = faker.string.uuid();
    const randomCategory = { id: Math.floor(Math.random() * 50) + 1 };

    generatedProducts.push({
      artikelnummer,
      namn: faker.commerce.productName(),
      pris: parseFloat(faker.commerce.price({ min: 10, max: 1000 })),
      lagerantal: faker.number.int({ min: 0, max: 1000 }),
      vikt: parseFloat(faker.number.float({ min: 0.1, max: 5 }).toFixed(2)),
      kategori_id: randomCategory.id,
      beskrivning: faker.commerce.productDescription(),
    });
  }
  return generatedProducts;
};

export const generateUpdatedProductData = (
  productIds: number[],
  categorieIds: number[]
): Produkt[] => {
  const updatedProducts: Produkt[] = [];

  productIds.forEach((productId, index) => {
    const kategoriId = categorieIds[index % categorieIds.length]; // Välj kategoriID baserat på index

    const updatedProduct: Produkt = {
      id: productId, // ID ska inte uppdateras
      artikelnummer: faker.string.uuid(), // Behåll unik artikelnummer för produkten
      namn: faker.commerce.productName(), // Exempel på att uppdatera namn
      pris: faker.number.float({ min: 50, max: 500 }), // Slumpmässigt pris mellan 50 och 500
      lagerantal: faker.number.int({ min: 1, max: 500 }), // Slumpmässigt lagerantal
      vikt: parseFloat(faker.number.float({ min: 0.1, max: 10 }).toFixed(2)), // Slumpmässig vikt mellan 0.1 och 10
      kategori_id: kategoriId, // Uppdaterad kategori ID
      beskrivning: faker.commerce.productDescription(), // Exempelbeskrivning
    };
    updatedProducts.push(updatedProduct);
  });

  return updatedProducts;
};
