const mysql = require("mysql2");
require("dotenv").config(); // make sure this is at the top

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Check if the connection was successful
db.connect((err) => {
  if (err) throw err;
  console.log("✅ Connected to MySQL database");
});

// export the db connection
module.exports = db;