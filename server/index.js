const db = require('./server').db;
const port = 3001;
const configCassandra = require('./../db/cassandra/index').configDb;
const connectPostgres = require('./../db/postgres/index').connection;

// db.connect('mongodb://localhost:27017/tittle', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// db.connection.once('open', _ => {
//   console.log('Mongo Database connected to "tittle"');
// });

// connectPostgres();

configCassandra();