require('dotenv').config();

const PORT = process.env.PORT || 5000
const express = require('express')
const app = express()
const routes = require('./routes/api')
const bodyParser = require('body-parser')
const WebSocket = require('ws');
const wss = new WebSocket.Server({port: 8080});

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

// Create the websockets.
wss.on('connection', function connection(ws) {
  console.log('connection')
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    ws.send('youre a ' + message);
  });
  //ws.send('something');
});

// Add an additional callback on posts to the weight data endpoint.
app.post('/api/weight-data', function (req, res, next) {
  console.log(wss.clients);
  wss.clients.forEach((ws) => {
    console.log('sending?')
    var data = {
      pod_uuid: req.body.pod_uuid,
      weight_value: req.body.weight_value,
      timestamp: req.body.timestamp,
    }
    ws.send(JSON.stringify(data))
  })
  res.status(200).send('Weight data inserted')
});

// Start the app.
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});
