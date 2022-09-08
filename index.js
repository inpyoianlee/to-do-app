// This is the Web Server
const express = require('express');
const server = express();

const cors = require('cors')
server.use(cors())

// create logs for everything
const morgan = require('morgan');
server.use(morgan('dev'));

// handle application/json requests
server.use(express.json());

// here's our static files
const path = require('path');
server.use(express.static(path.join(__dirname, 'build')));

// here's our API
server.use('/api', require('./routes'));

// by default serve up the react app if we don't recognize the route
server.use((req, res, next) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
});

server.use((req, res, next) => {
  console.log("404: Page not found");
  res.status(404)
  res.send("Request failed with status code 404");
});

server.use((err, req, res, next) => {
  console.log("500: Internal Server Error");
  res.status(500).send({ error: err.message });
});

// bring in the DB connection
const client = require('./db/client');

// connect to the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, async () => {
  console.log(`Server is running on ${ PORT }!`);

  try {
    await client.connect();
    console.log('Database is open for business!');
  } catch (error) {
    console.error("Database is closed for repairs!\n", error);
  }
});