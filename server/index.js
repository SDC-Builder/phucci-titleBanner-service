var express = require('express');
var cors = require('cors');

var app = express();
var bodyParser = require('body-parser');

var title = require('./routes/title').router;
var enrolled = require('./routes/enrolled').router;

const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

app.use(express.static(__dirname + '/../client/dist'));
app.use(cors());

let port = 3001;

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

mongoose.connect('mongodb://localhost:27017/tittle');


const db = mongoose.connection;

db.once('open', _ => {
  console.log('Mongo Database connected');
});

//routes to get and add title
app.use('/api', title);


//TODO second table
app.use('/api', enrolled);

app.get('/*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../public/index.html'));
});

app.listen(port, function() {
  console.log(`Server started and listening on port ${port}`);
});