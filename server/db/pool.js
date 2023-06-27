const mysql = require('mysql');
const config = require('./config.json');

// Create a pool of connections
const pool = mysql.createPool({
  connectionLimit: 10,
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database,
  ssl: {
    // SSL options required by the Azure MySQL server
    rejectUnauthorized: true
  }
});

module.exports = pool;