require('dotenv').config();

const PORT = process.env.PORT || 5000
const express = require('express')
const app = express()
const routes = require('./routes/api')
const bodyParser = require('body-parser')
const path = require('path')
const http = require('http')

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



const WebSocket = require('ws');
//const server = http.createServer(app);
const wss = new WebSocket.Server({port: 8080});

wss.on('connection', function connection(ws) {
  console.log('connection')
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    ws.send('youre a ' + message);
  });
  ws.send('something');
});

app.post('/api/weight-data',function (req, res, next) {
  console.log(wss.clients);
  wss.clients.forEach((ws) => {
    console.log('sending?')
    var data = {
      pod_uuid: req.body.pod_uuid,
      weight_value: req.body.weight_value,
    }
    ws.send(JSON.stringify(data))
  })
  res.status(200).send('Weight data inserted')
});



const { createProxyMiddleware } = require('http-proxy-middleware');

//app.use('/ws', createProxyMiddleware({ target: 'localhost:8080', ws: true }));

const wsProxy = createProxyMiddleware('/ws', {target:'ws://localhost:8080', ws:true});
app.use(wsProxy);

// Start the app.
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});



//const httpProxy = require('http-proxy');
//const http = require('http');
//
// Create your proxy server and set the target in the options.
//
//httpProxy.createProxyServer({target:'http://localhost:5000'}).listen(3000); // See (†)
//httpProxy.createProxyServer({ target: 'ws://localhost:8080', ws: true }).listen(5000);
//
// Create your target server
//
// http.createServer(function (req, res) {
//   res.writeHead(200, { 'Content-Type': 'text/plain' });
//   res.write('request successfully proxied!' + '\n' + JSON.stringify(req.headers, true, 2));
//   res.end();
// }).listen(9000);


// server.on('request', app);
//
// server.listen(PORT, () => {
//   console.log(`Server started on port ${server.address().port} :)`);
// });
//module.exports = wss;

// server.listen(process.env.PORT || 8999, () => {
//   console.log(`Server started on port ${server.address().port} :)`);
// });