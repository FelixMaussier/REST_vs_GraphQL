const db = require('./config/db');
const { faker } = require('@faker-js/faker');

async function generateData() {
  try {
    console.log('🚀 Startar datagenerering...');
    console.log('Ansluter till databas:', process.env.DB_NAME);

    // Ta bort gammal data
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

    // Skapa 500 produkter
    const produktData = [];
    for (let i = 0; i < 500; i++) {
      produktData.push({
        artikelnummer: faker.string.uuid(),
        namn: faker.commerce.productName(),
        pris: faker.commerce.price({ min: 10, max: 1000 }),
        lagerantal: faker.number.int({ min: 0, max: 100 }),
        vikt: faker.number.float({ min: 0.1, max: 5, precision: 0.01 }),
        kategori_id: faker.helpers.arrayElement(kategoriIds),
        beskrivning: faker.commerce.productDescription(),
      });
    }

    const insertedProdukts = await db('produkt').insert(produktData).returning('id');
    console.log(`✅ Skapade ${insertedProdukts.length} produkter!`);

    // Skapa attribut
    const produktAttributData = [];
    for (const produkt of insertedProdukts) {
      const produktId = produkt.id || produkt;

      produktAttributData.push(
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
    }

    await db('produktattribut').insert(produktAttributData);
    console.log(`✅ Skapade attribut för ${insertedProdukts.length} produkter!`);

    console.log('🎉 Allt klart!');
  } catch (err) {
    console.error('❌ Fel vid generering:', err.message);
  } finally {
    await db.destroy();
  }
}

generateData();