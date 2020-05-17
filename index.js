require('dotenv').config();
const PORT = process.env.PORT || 3000;

const express = require('express')
const app = express()
const routes = require('./routes/api');
const bodyParser = require('body-parser');

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Use Bodyparser middleware.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve the API routes.
app.use('/api', routes);

// Start the app.
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});