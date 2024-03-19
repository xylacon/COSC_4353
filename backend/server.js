const express = require("express");
const cors = require("cors");
const app = express();

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
//API for login endpoint

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);

  //verify user from example data
  const user = users.find((user) => user.email === email);

  if (!user) {
    return res.status(401).send("User not found");
  }

  // Check password
  if (user.password !== password) {
    return res.status(401).send("INCORRECT PASSWORD");
  }

  res.status(200).send("SUCCESS");
});

// Api for fuel quote
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
    res.status(400).send("delivery address is empty or invalid");
  }

  // validate suggested price per gallon is numeric
  if (isNaN(data.suggestedPrice)) {
    res.status(400).send("error suggested price not a number");
  }

  // Calculate cost
  const newQuotePrice = (data.gallonsRequested * data.suggestedPrice).toFixed(
    2
  );

  res.status(200).send(newQuotePrice);
});

// Api for fuel history
app.get("/fuelhistory", (req, res) => {
  // return hardcoded values of fuel quotes
  const fuelQuoteHistory = [
    {
      gallonsRequested: 20,
      deliveryAddress: "1900 Coco Drive. Houston, TX 77882",
      deliveryDate: "2/28/24",
      suggestedPrice: 3.14,
      totalPrice: 60,
    },
    {
      gallonsRequested: 20,
      deliveryAddress: "1900 Coco Drive. Houston, TX 77882",
      deliveryDate: "3/18/24",
      suggestedPrice: 3.14,
      totalPrice: 60,
    },
    {
      gallonsRequested: 20,
      deliveryAddress: "1900 Coco Drive. Houston, TX 77882",
      deliveryDate: "4/2/24",
      suggestedPrice: 3.14,
      totalPrice: 60,
    },
  ];

  res.status(200).send(fuelQuoteHistory);
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
