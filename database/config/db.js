const knex = require('knex');
const { resolve } = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: resolve(__dirname, '../../.env') });

const db = knex({
  client: 'pg',
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  pool: { min: 0, max: 20 },
});

// Testa anslutningen
// async function testConnection() {
//   try {
//     const result = await db.raw('SELECT current_database()');
//     console.log('Ansluten till databas:', result.rows[0].current_database);
//     console.log('✅ Anslutningen lyckades!');
//     console.log('PostgreSQL version:', result.rows[0].version);
    

//   } catch (error) {
//     console.error('❌ Fel vid anslutning:', error.message);
//   } finally {
//     await db.destroy();
//   }
// }

// testConnection();

module.exports = db;