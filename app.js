const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const express = require("express");
const session = require("express-session");
const cors = require("cors");
const db = require("./db"); // Import the database connection
const app = express();

const generateSecretKey = () => {
  return crypto.randomBytes(32).toString("hex");
};

function generateRandomClientId() {
  const min = 1000000; // Minimum 7-digit number (inclusive)
  const max = 9999999; // Maximum 7-digit number (inclusive)
  const clientId = Math.floor(Math.random() * (max - min + 1)) + min;
  return clientId;
}

// Configure express-session middleware
app.use(
  session({
    secret: generateSecretKey(), // Change this to a secure random key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set secure to true in production with HTTPS
  })
);

app.use(cors());
app.use(express.json());

app.get("/", function (req, res) {
  res.send("Hello World");
});
// Example user data
const users = [
  {
    id: 1,
    email: "test@example.com",
    password: "password123",
    name: "John Doe",
  },
];

// API for client registration

app.post("/client-registration", async (req, res) => {
  const { email, password } = req.body;

  // Validate password length
  if (password.length < 8) {
    return res.status(401).send("Password must be at least 8 characters long");
  }

  console.log(req.body);

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

  // Insert into your database (assuming you have a UserCredentials table)
  const newUser = {
    email: email,
    password: hashedPassword,
    UserCredentialsID: generateRandomClientId(), // Assuming you have a function to generate random client IDs
  };

  // Check if the user with the same email already exists
  const checkQuery = `SELECT * FROM UserCredentials WHERE Username = ?`;
  db.query(checkQuery, [newUser.email], (err, result) => {
    if (err) {
      console.error("Error checking user existence:", err);
      return res.status(500).send("Error checking user existence");
    }

    if (result.length > 0) {
      // User with the same email already exists
      console.error("User with this email already exists");
      return res
        .status(400)
        .send("User with this email already exists, Please login instead!");
    }

    // User does not exist, proceed with insertion
    const insertQuery = `INSERT INTO UserCredentials (Username, Password, UserCredentialsID) VALUES (?, ?, ?)`;
    db.query(
      insertQuery,
      [newUser.email, newUser.password, newUser.UserCredentialsID],
      (err, result) => {
        if (err) {
          console.error("Error inserting user:", err);
          return res.status(500).send("Error inserting user data!");
        }
        console.log("User inserted into database!");
        req.session.UserCredentialsID = newUser.UserCredentialsID;
        res.status(200).send("Resgistration Successful!");
      }
    );
  });
});
//API for login endpoint

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  // Validate password length
  if (password.length < 8) {
    return res.status(401).send("Password must be at least 8 characters long");
  }

  console.log(req.body);

  const selectQuery = `SELECT * FROM UserCredentials WHERE Username = ?`;
  db.query(selectQuery, [email], async (err, result) => {
    if (err) {
      console.error("Error retrieving user:", err);
      return res.status(500).send("Error retrieving user data");
    }
    if (result.length === 0) {
      return res.status(401).send("User does not exist!");
    }
    const foundUser = result[0];
    const isMatch = await bcrypt.compare(password, foundUser.Password);
    if (!isMatch) {
      return res.status(401).send("Incorrect password, Please try again!");
    }
    req.session.UserCredentialsID = foundUser.UserCredentialsID;
    res.status(200).send("SUCCESS");
  });
});

// Api for fuel quote get
app.get("/fuelquote", (req, res) => {
  //hardcoded values
  const hardcodedValues = {
    deliveryAddress: "1900 Coco Drive. Houston, TX 77882",
    suggestedPrice: "3.14",
  };

  res.status(200).send(hardcodedValues);
});

// Api for fuel quote post
app.post("/fuelquote", (req, res) => {
  console.log(req.body);
  const data = req.body;
  // validate data
  // validate that gallons requested is numeric
  if (isNaN(data.gallonsRequested)) {
    res.status(400).send("error gallons requested is not a number");
  }

  // validate delivery address is not empty
  if (data.deliveryAddress.length === 0 || data.deliveryAddress === null) {
    res.status(400).send("delivery address is empty or invalid");
  }

  // validate delivery date is not empty
  if (data.deliveryDate.length === 0 || data.deliveryDate === null) {
    res.status(400).send("delivery date is empty or invalid");
  }

  // validate delivery date is valid
  const regex = /^(19|20)\d\d-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
  if (!regex.test(data.deliveryDate)) {
    res.status(400).send("invalid date format, date is not in yyyy-mm-dd form");
  }

  // validate suggested price per gallon is numeric
  if (isNaN(data.suggestedPrice)) {
    res.status(400).send("error suggested price is not a number");
  }

  // Calculate cost
  const newQuotePrice = (data.gallonsRequested * data.suggestedPrice).toFixed(
    2
  );

  
  /*
  db.query(
    `
    SELECT *
    FROM ClientInformation
    WHERE UserCredentialsID = ${req.session.UserCredentialsID}
    `, (err, results) => {
      if (err){
        throw err;
      }
    
      const clientInformationID = results.ClientInformationID;
      
      db.query(
        `
        INSERT INTO Quote (ClientInformationID, GallonsRequested, DeliveryDate, SuggestedPrice)
        VALUES(${clientInformationID}, ${data.gallonsRequested}, ${data.deliveryDate}, ${data.suggestedPrice});
        `
      ), (err) => {
        if (err) {
          throw err;
        }
      }

    }
  )
  */

  db.query(
    `
    INSERT INTO Quote (ClientInformationID, GallonsRequested, DeliveryDate, SuggestedPrice)
    VALUES(2, ${data.gallonsRequested}, '${data.deliveryDate}', ${data.suggestedPrice});
    `
  ), (err) => {
    if (err) {
      throw err;
    }
  }

  res.status(200).send(newQuotePrice);
});

// Api for fuel history
app.get("/fuelhistory", (req, res) => {

  db.query(
    `SELECT CI.*, Q.*
    FROM (
        SELECT *
        FROM ClientInformation
        WHERE ClientInformationID = 2
    ) AS CI
    LEFT JOIN Quote Q ON CI.ClientInformationID = Q.ClientInformationID

    UNION

    SELECT CI.*, Q.*
    FROM (
        SELECT *
        FROM ClientInformation
        WHERE ClientInformationID = 2
    ) AS CI
    RIGHT JOIN Quote Q ON CI.ClientInformationID = Q.ClientInformationID;
    `,
    function (error, results) {
      if (error) throw error;
      res.send(results);
    }
  );

  //res.status(200).send(fuelQuoteHistory);
});

// API for Client Profile
app.get("/client-profile", (req, res) => {
  // Return hard-coded values for client
  const clientProfile = {
    name: "John Doe",
    address1: "123 Main St",
    address2: "",
    city: "Houston",
    state: "TX",
    zip: "77006",
  };

  res.status(200).send(clientProfile);
});

app.post("/client-profile", (req, res) => {});

module.exports = app;
