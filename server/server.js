var express = require('express');
var cors = require('cors');
// const helenus = require('helenus');

var app = express();
var bodyParser = require('body-parser');

var title = require('./routes/title').router;
var enrolled = require('./routes/enrolled').router;

const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');


app.use(express.static(__dirname + '/../client/dist'));
app.use(cors());

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

app.get('/*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../public/index.html'));
});

const server = app.listen(port, function () {
  console.log(`listenting on port:${port}`);
});


module.exports.server = server;
module.exports.db = mongoose;