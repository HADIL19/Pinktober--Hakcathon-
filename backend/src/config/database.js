// backend/src/config/database.js
import mysql from 'mysql2/promise';

// Configuration de la connexion MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'isill3',
  database: process.env.DB_NAME || 'pinkhope',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true
});

// Test de connexion
pool.getConnection()
  .then(connection => {
    console.log('🗄️ MySQL connecté avec succès!');
    connection.release();
  })
  .catch(error => {
    console.error('❌ Erreur connexion MySQL:', error.message);
    process.exit(1);
  });

export default pool;