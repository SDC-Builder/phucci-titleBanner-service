require('newrelic');
var express = require('express');
var cors = require('cors');
const morgan = require('morgan');
// const helenus = require('helenus');

var app = express();
var bodyParser = require('body-parser');

var title = require('./routes/mongo/title').router;
var enrolled = require('./routes/mongo/enrolled').router;
const cassandraTittles = require('./routes/cassandra/tittle').router;
const postgresTitles = require('./routes/postgres/title').router;

const mongoose = require('mongoose');
const path = require('path');``
const dotenv = require('dotenv');


app.use(express.static(__dirname + '/../client/dist'));
app.use(cors());
// app.use(morgan('dev'));

const port = 3001;

dotenv.config();

// mongo environment variables
const {
  MONGO_HOSTNAME,
  MONGO_DB,
  MONGO_PORT,
  PORT
} = process.env;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//routes to get and add title
app.use('/api', title);


//TODO second table
app.use('/api', enrolled);

app.use('/api', cassandraTittles);
app.use('/api', postgresTitles);


app.get('/*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../public/index.html'));
});

const server = app.listen(port, function () {
  console.log(`listenting on port:${port}`);
});

server.keepAliveTimeout = 100000;
server.headersTimeout = 1000000000;


module.exports.server = server;
module.exports.db = mongoose;