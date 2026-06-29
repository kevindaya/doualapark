const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME     || 'douala_park',
  user:     process.env.DB_USER     || 'postgres',
  password: process.env.DB_PASSWORD || '',
});

pool.connect()
  .then(client => {
    console.log('✅ PostgreSQL connecté');
    client.release();
  })
  .catch(err => {
    console.error('❌ Erreur connexion PostgreSQL :', err.message);
    process.exit(1);
  });

module.exports = pool;
