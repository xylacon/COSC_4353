const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());

app.get('/', function (req, res) {
  res.send('Hello World');
})

// Api for fuel quote
app.get('/fuelquote', (req, res) => {
  res.status(200).send("asdfadsf");
})

// Api for fuel history
app.get('/fuelhistory', (req, res) => {
  res.status(200).send("adsf");
})


app.listen(3000, () => {
  console.log('Server is running on port 3000');
})