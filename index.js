require('dotenv').config();
const PORT = process.env.PORT || 5000;

const express = require('express')
const app = express()
const routes = require('./routes/api')
const bodyParser = require('body-parser')
const path = require('path')

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Use Bodyparser middleware.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// Serve the API routes.
app.use('/api', routes);

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

// Start the app.
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});