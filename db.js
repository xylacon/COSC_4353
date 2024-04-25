// db.js
const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "sql10.freemysqlhosting.net",
  user: "sql10701138",
  password: "gKlgX6jzMp",
  database: "sql10701138",
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
