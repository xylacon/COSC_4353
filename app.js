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

    const clientInfoQuery = `SELECT ClientInformationID FROM ClientInformation WHERE UserCredentialsID = ?`;
    db.query(
      clientInfoQuery,
      [foundUser.UserCredentialsID],
      (clientErr, clientResult) => {
        if (clientErr) {
          console.error("Error retrieving client information:", clientErr);
          return res.status(500).send("Error retrieving client information");
        }

        req.session.ClientInformationID = clientResult[0].ClientInformationID;

        res.status(200).send(`SUCCESS`);
      }
    );
  });
});

// Api for fuel quote get
app.get("/fuelquote", (req, res) => {
  db.query(
    `
    SELECT *
    FROM ClientInformation
    WHERE ClientInformationID = ${req.session.ClientInformationID}
    `,
    (err, result) => {
      if (result.length === 0) {
        return res.status(400).send("no quotes");
      }

      res.status(200).send(result);
    }
  );
});

// Api for fuel quote "Get Quote" button
app.post("/fuelquote/getquote", (req, res) => {
  const data = req.body;

  if (isNaN(data.gallonsRequested)) {
    return res.status(400).send("error gallons requested is not a number");
  }

  // Calculate variable suggested price
  const pricePerGallon = 1.5;
  const locationFactor = data.state === "TX" ? 0.02 : 0.04;

  let numQuotes = 0;
  db.query(
    `
    SELECT COUNT(*) 
    FROM Quote
    WHERE ClientInformationID = ${req.session.ClientInformationID}
    `,
    (err, result) => {
      if (err) {
        return res.status(500).send("Error adding quote");
      }
      numQuotes = result;
    }
  );
  const historyFactor = numQuotes >= 1 ? 0.01 : 0;
  const requestedFactor = data.gallonsRequested > 1000 ? 0.02 : 0.03;
  const profitFactor = 0.1;

  const margin =
    pricePerGallon *
    (locationFactor - historyFactor + requestedFactor + profitFactor);

  const suggestedPrice = pricePerGallon + margin;

  // Calculate cost
  const newQuotePrice = (data.gallonsRequested * suggestedPrice).toFixed(2);

  const quoteInformation = {
    clientSuggestedPrice: suggestedPrice,
    clientTotalPrice: newQuotePrice,
  };

  res.status(200).send(quoteInformation);
});

// Api for fuel quote post
app.post("/fuelquote", (req, res) => {
  const data = req.body;
  // validate data
  // validate that gallons requested is numeric
  if (isNaN(data.gallonsRequested)) {
    return res.status(400).send("error gallons requested is not a number");
  }

  // validate delivery address is not empty
  if (data.deliveryAddress.length === 0 || data.deliveryAddress === null) {
    return res.status(400).send("delivery address is empty or invalid");
  }

  // validate delivery date is not empty
  if (data.deliveryDate.length === 0 || data.deliveryDate === null) {
    return res.status(400).send("delivery date is empty or invalid");
  }

  // validate delivery date is valid
  const regex = /^(19|20)\d\d-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
  if (!regex.test(data.deliveryDate)) {
    return res
      .status(400)
      .send("invalid date format, date is not in yyyy-mm-dd form");
  }

  // Calculate variable suggested price
  const pricePerGallon = 1.5;
  const locationFactor = data.state === "TX" ? 0.02 : 0.04;

  let numQuotes = 0;
  db.query(
    `
    SELECT COUNT(*) 
    FROM Quote
    WHERE ClientInformationID = ${req.session.ClientInformationID}
    `,
    (err, result) => {
      if (err) {
        return res.status(500).send("Error adding quote");
      }
      numQuotes = result;
    }
  );
  const historyFactor = numQuotes >= 1 ? 0.01 : 0;
  const requestedFactor = data.gallonsRequested > 1000 ? 0.02 : 0.03;
  const profitFactor = 0.1;

  const margin =
    pricePerGallon *
    (locationFactor - historyFactor + requestedFactor + profitFactor);

  const suggestedPrice = pricePerGallon + margin;

  // Calculate cost
  const newQuotePrice = (data.gallonsRequested * suggestedPrice).toFixed(2);

  db.query(
    `
    INSERT INTO Quote (ClientInformationID, GallonsRequested, DeliveryDate, SuggestedPrice)
    VALUES(${req.session.ClientInformationID}, ${data.gallonsRequested}, '${data.deliveryDate}', ${suggestedPrice});
    `
  );

  res.status(200).send(newQuotePrice);
});

// Api for fuel history
app.get("/fuelhistory", (req, res) => {
  db.query(
    `
    SELECT CI.*, Q.*
    FROM ClientInformation AS CI
    INNER JOIN Quote AS Q ON CI.ClientInformationID = Q.ClientInformationID
    WHERE CI.ClientInformationID = ${req.session.ClientInformationID};
    `,
    function (error, results) {
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
    WHERE ClientInformationID = ${clientId}
  `;

  db.query(selectQuery, (err, result) => {
    if (result.length < 1) {
      console.error("Client information not found for ID: ", clientId);
      return res.status(404).send("Client profile not found");
    }

    const clientInfo = result[0];
    const clientProfile = {
      name: clientInfo.Name,
      address1: clientInfo.Address1,
      address2: clientInfo.Address2,
      city: clientInfo.City,
      state: clientInfo.State,
      zip: clientInfo.Zip,
    };

    res.status(200).send(clientProfile);
  });
});

app.post("/client-profile", (req, res) => {
  console.log(req.body);
  clientId = req.session.ClientInformationID;
  const { name, address1, address2, city, state, zip } = req.body;
  let errors = [];

  // Name validation
  if (!name || name.length < 1) {
    errors.push("Name cannot be empty.");
  } else if (name.length > 50) {
    errors.push("Name cannot exceed 50 characters.");
  }

  // Address1 validation
  if (!address1 || address1.length < 1) {
    errors.push("Address1 cannot be empty.");
  } else if (address1.length > 100) {
    errors.push("Address1 cannot exceed 100 characters.");
  }

  // Address2 validation
  if (address2.length > 100) {
    errors.push("Address2 cannot exceed 100 characters.");
  }

  // City validation
  if (!city || city.length < 1) {
    errors.push("City cannot be empty.");
  } else if (city.length > 100) {
    errors.push("City cannot exceed 100 characters.");
  }

  // State validation
  if (!state || state.length < 2) {
    errors.push("State must be specified.");
  } else if (state.length > 2) {
    errors.push("Invalid state format.");
  }

  // Zip validation
  if (!zip || zip.length < 1) {
    errors.push("Zip cannot be empty.");
  } else if (zip.length < 5) {
    errors.push("Zip must be at least 5 characters.");
  } else if (zip.length > 9) {
    errors.push("Zip cannot exceed 9 characters.");
  }

  if (errors.length > 0) {
    console.error("Validation errors:", errors);
    return res.status(401).send(errors.join("\n"));
  }

  const updateQuery = `
    UPDATE ClientInformation
    SET Name = '${name}', Address1 = '${address1}', Address2 = '${address2}', City = '${city}', State = '${state}', Zip = '${zip}'
    WHERE ClientInformationId = ${clientId}
  `;
  db.query(updateQuery, (err, result) => {
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

// FOR TESTING PURPOSES
app.post("/set-session", (req, res) => {
  req.session.ClientInformationID = req.body.ClientInformationID;
  res.status(200).send("Session updated");
});

module.exports = app;
