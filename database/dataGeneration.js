const db = require('./config/db');
const { faker } = require('@faker-js/faker');

const TOTAL_PRODUCTS = 150000;
const BATCH_SIZE = 1000;

async function generateData() {
  try {
    console.log('🚀 Startar datagenerering');
    console.log('Ansluter till databas:', process.env.DB_NAME);

    // Rensa gammal data
    await db('produktattribut').del();
    await db('produkt').del();
    await db('kategori').del();

    // Skapa 50 kategorier
    const kategoriIds = [];
    for (let i = 0; i < 50; i++) {
      const [kategori] = await db('kategori')
        .insert({
          namn: faker.commerce.department() + `-${i}`,
          beskrivning: faker.lorem.sentence(),
        })
        .returning('id');
      kategoriIds.push(kategori.id || kategori);
    }
    console.log(`✅ Skapade ${kategoriIds.length} kategorier!`);

    const insertedProdukts = [];

    // Skapa produkter i batchar
    for (let i = 0; i < TOTAL_PRODUCTS; i += BATCH_SIZE) {
      const produktBatch = [];

      for (let j = 0; j < BATCH_SIZE && (i + j) < TOTAL_PRODUCTS; j++) {
        produktBatch.push({
          artikelnummer: faker.string.uuid(),
          namn: faker.commerce.productName(),
          pris: faker.commerce.price({ min: 10, max: 1000 }),
          lagerantal: faker.number.int({ min: 0, max: 100 }),
          vikt: faker.number.float({ min: 0.1, max: 5, precision: 0.01 }),
          kategori_id: faker.helpers.arrayElement(kategoriIds),
          beskrivning: faker.commerce.productDescription(),
        });
      }

      const inserted = await db('produkt').insert(produktBatch).returning('id');
      insertedProdukts.push(...inserted);
      console.log(`✅ Batch ${Math.floor(i / BATCH_SIZE) + 1} skapad med ${inserted.length} produkter`);
    }

    // Skapa attribut för varje produkt i batchar
    const attributBatch = [];
    for (let i = 0; i < insertedProdukts.length; i++) {
      const produktId = insertedProdukts[i].id || insertedProdukts[i];

      attributBatch.push(
        {
          produkt_id: produktId,
          attribut_namn: 'Färg',
          attribut_varde: faker.color.human(),
        },
        {
          produkt_id: produktId,
          attribut_namn: 'Material',
          attribut_varde: faker.commerce.productMaterial(),
        },
        {
          produkt_id: produktId,
          attribut_namn: 'Storlek',
          attribut_varde: faker.helpers.arrayElement(['S', 'M', 'L', 'XL']),
        },
        {
          produkt_id: produktId,
          attribut_namn: 'Märke',
          attribut_varde: faker.company.name(),
        },
        {
          produkt_id: produktId,
          attribut_namn: 'Producent',
          attribut_varde: faker.company.name(),
        }
      );

      // Skriv till databasen i batchar om 5 000 attribut (1000 produkter * 5 attribut)
      if (attributBatch.length >= 5000 || i === insertedProdukts.length - 1) {
        await db('produktattribut').insert(attributBatch);
        console.log(`✅ Skapade attribut för ${attributBatch.length / 5} produkter`);
        attributBatch.length = 0; // Töm batchen
      }
    }

    console.log('🎉 Allt klart!');
  } catch (err) {
    console.error('❌ Fel vid generering:', err.message);
  } finally {
    await db.destroy();
  }
}

generateData();