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
  const min = 1000000;
  const max = 9999999;
  const clientId = Math.floor(Math.random() * (max - min + 1)) + min;
  return clientId;
}

// Configure express-session middleware
app.use(
  session({
    secret: generateSecretKey(),
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
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

  const newUser = {
    email: email,
    password: hashedPassword,
    UserCredentialsID: generateRandomClientId(),
    ClientInformationID: generateRandomClientId(),
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
    const insertQuery2 = `INSERT INTO ClientInformation (ClientInformationID, UserCredentialsID) VALUES (?, ?)`;
    db.query(
      insertQuery,
      [newUser.email, newUser.password, newUser.UserCredentialsID],
      (err, result) => {
        if (err) {
          console.error("Error inserting user:", err);
          return res.status(500).send("Error inserting user data!");
        }

        db.query(
          insertQuery2,
          [newUser.ClientInformationID, newUser.UserCredentialsID],
          (err, result) => {
            if (err) {
              console.error("Error inserting user:", err);
              return res.status(500).send("Error inserting user data!");
            }
            console.log("User inserted into database!");
            req.session.ClientInformationID = newUser.ClientInformationID;
            res.status(200).send("Resgistration Successful!");
          }
        );
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
  ),
    (err) => {
      if (err) {
        throw err;
      }
    };

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
  clientId = req.session.ClientInformationID;
  const selectQuery = `
    SELECT Name, Address1, Address2, City, State, Zip
    FROM ClientInformation
    WHERE ClientInformationId = ${clientId}
  `;

  db.query(selectQuery, (err, result) => {
    if (err) {
      console.error("Error retreiving information: ", err);
      return res.status(500).send("Error retreiving information.");
    }
    if (result.length < 1) {
      console.error("Client information not found for ID: ", clientId);
      return res.status(404).send("Client profile not found")
    }

    const clientInfo = result[0];
    const clientProfile = {
      name: clientInfo.Name,
      address1: clientInfo.Address1,
      address2: clientInfo.Address2,
      city: clientInfo.City,
      state: clientInfo.State,
      zip: clientInfo.Zip
    };
  
    res.status(200).send(clientProfile);
  });
});

app.post("/client-profile", (req, res) => {
  console.log(req.body);
  clientId = req.session.ClientInformationID;
  const { name, address1, address2, city, state, zip } = req.body;

  if (name.length < 1 || name.length > 50) {
    console.error("Name cannot exceed 50 characters.");
    return res.status(401).send("Name cannot exceed 50 characters.");
  }
  if (address1.length < 1 || address1.length > 100) {
    console.error("Address 1 cannot exceed 100 characters.");
    return res.status(401).send("Address 1 cannot exceed 100 characters.");
  }
  if (address2.length > 100) {
    console.error("Address 2 cannot exceed 100 characters.");
    return res.status(401).send("Address 2 cannot exceed 100 characters.");
  }
  if (city.length < 1 || city.length > 100) {
    console.error("City cannot exceed 100 characters.");
    return res.status(401).send("City cannot exceed 100 characters.");
  }
  if (state.length != 2) {
    console.error("State must be specified.");
    return res.status(401).send("State must be 2 characters.");
  }
  if (zip.length < 5 || zip.length > 9) {
    console.error("Zip must be between 5 and 9 characters.");
    return res.status(401).send("Zip must be between 5-9 numbers.");
  }

  const updateQuery = `
    UPDATE ClientInformation
    SET Name = '${name}', Address1 = '${address1}', Address2 = '${address2}', City = '${city}', State = '${state}', Zip = '${zip}'
    WHERE ClientInformationId = ${clientId}
  `;
  db.query(updateQuery, (err, result) => {
    if (err) {
      console.error("Error updating information: ", err);
      return res.status(500).send("Error updating information.");
    }
    console.log("Client information updated in database.");
    return res.status(200).send("Client information updated in database.");
  });
});

app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      // Handle the error, maybe send an error response
      return res.status(500).send("Error destroying session.");
    }
    // Session destroyed successfully
    res.clearCookie("sessionID"); // Clear the session cookie
    res.status(200).send("Logged out successfully.");
  });
});

module.exports = app;
