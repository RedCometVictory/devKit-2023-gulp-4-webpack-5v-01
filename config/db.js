require('dotenv').config(); // get 'mongoURI' from environment value
// pick a database - release connection to sql db when finished running a query!

// PostgreSQL
// const { Pool, Client } = require('pg');
const { Pool } = require('pg');

// const client = new Client({
const pool = new Pool({
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  max: 10,
  idleTimeoutMillis: 300000
});
// ==================================================
// EXAMPLES POSTGRES
/*
// Postgres
const pool = require('./config/db');
// const client = require('./config/db');

const query = async () => {
  await client.connect();
}

// sample query
client.query('SELECT * FROM demo_table WHERE id = $1', [4], (err, result) => {
  if(!err) {
    console.log(result.rows); // print all rows of table
  }
  // console.log(err, result);
  client.end();
});

// execute above query
query();
*/
/*
// alt version
(async () => { 
  await client.connect();
  const result = await client.query('SELECT * FROM demo_table WHERE id = $1', [2]);
  const result2 = await client.query('INSERT INTO demo_table(name, address) VALUES($1, $2) RETURNING *', ['Momoka', '2331 N. Lavender Ave.']);
  console.log(result2.rows);
  console.log(result2.rowCount);
  client.end();
})();
*/
// get client from pool
// pool.connect((err, client, release) => {
//   if (err) {
//     return console.error("Connection to Postgres db failed...", err.stack);
//   }
//   client.query('SELECT * FROM demo_table', (err, result) => {
//     release();
//     if (err) {
//       return console.error("Connection to Postgres db failed...", err.stack);
//     }
//     console.log(result.rows);
//   });
// })

// ==================================================
// const devConfig = `postgresql://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_DATABASE}`;
  
// for production

// //heroku addons
// const proConfig = process.env.DATABASE_URL;

// const pool = new Pool({
//   connectionString: process.env.NODE_ENV === "production" ? proConfig : devConfig,
//   // connectionString: process.env.DATABASE_URL,
//   ssl: {
//     require: true,
//     rejectUnauthorized: false
//   } 
// });

// for development
pool.on("connect", () => {
  console.log('Connected to postgres database...');
});
pool.on('error', (err) => {
  console.error("Postgres db error...", err.message, err.stack)
});
pool.on("end", () => {
  console.log('Connection to postgres database ended...');
});

// ========================================
// ========================================
// ========================================
// MySQL - mysql2
/*
const mysql = require('mysql2'); // for connection pool
// const mysql = require('mysql2/promise'); // if only using createConnection()

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10
  // queueLimit: 0
});

pool.connect((err) => {
  if (!err) {
    console.log('Connected to MySQL!');
  } else {
    console.log('Connection to MySQL failed!');
  }
}) 
*/
// ========================================
/* examples
const db = require('./config/db');
db.execute('SELECT * FROM demo_table')
  .then(result => {
    console.log(result);
    console.log(result[0], result[1]);
  })
  .catch(err => {
    console.log(err);
  })
*/
// db.execute(
  // "INSERT INTO demo_table (title, price, description, imageUrl) VALUES (?, ?, ?, ?)",
  // [this.title, this.price, this.description, this.imageUrl]
// );

// inject value into db via [], return all columns with the selected product id
// db.execute("SELECT * FROM demo_table WHERE demo_table.id = ?", [id]);
// =======================================
// =======================================
// =======================================

// MongoDB - ATLAS
// DATABASE
// const connectDB = require('./congif/db'); or set as ->  require(process.env.MONGO_URI);


// database connection (mongodb)
// connectDB();
/*
const mongoose = require('mongoose');
// const config = require('config');  // use config or dotenv
// const db = config.get('mongoURI'); // get 'mongoURI' value from config/default.json

const db = process.env.MONGO_URI;


const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected....');
  } catch(err) {
    console.log(err.message);
    // exit process w/failure
    process.exit(1);
  }
};
*/

// module.exports = connectDB; // mongodb
// module.exports = pool; // postgres
// module.exports = {
  // query: (text, params) => pool.query(text,params)
// }; 
// module.exports = pool.promise(); // mysql