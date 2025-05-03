// Connect to MYSQL database using mysql2 package
const mysql = require('mysql2');
const db = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});


// Check if the connection was successful
db.connect((err) => {
    if (err) throw err;
    console.log("✅ Connected to MySQL database");
  });

// export the db connection
module.exports = db;