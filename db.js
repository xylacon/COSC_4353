// db.js
const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "sql3.freemysqlhosting.net",
  user: "sql3697781",
  password: "X6uNwudW9b",
  database: "sql3697781",
  port: 3306,
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL database:", err);
    return;
  }
  console.log("Connected to MySQL database!");
});

module.exports = connection;
