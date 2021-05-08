const cassandra = require('cassandra-driver');
const client = new cassandra.Client({ contactPoints: ['127.0.0.1'], localDataCenter: 'datacenter1' });


client.connect()
  .then(() => {
    console.log('connected');
    const query = "CREATE KEYSPACE IF NOT EXISTS tittle WITH replication =" +
      "{'class': 'SimpleStrategy', 'replication_factor': '1' }";
    return client.execute(query);
  })
  .then(() => {
    const query = "CREATE TABLE IF NOT EXISTS tittle" +
      " (id int, tittle text, enrollments int, PRIMARY KEY(id,tittle))";
    return client.execute(query);
  })
  .then(() => {
    console.log('table created');
    return client.metadata.getTable('tittle', 'tittle');
  })
  .then((table) => console.log('table = ', table))
  .catch((err) => {
    console.log('ERROR CONFIGURING = ', err);
  })

// const client = new cassandra.Client({ contactPoints: ['host1'] });

// client.connect(function (err) {
//   console.log('ERROR CONNECTING = ', err);
// });



// const cassandra = require('cassandra-driver');

// const client = new cassandra.Client({
//   contactPoints: ['h1', 'h2'],
//   localDataCenter: 'datacenter1',
//   keyspace: 'ks1'
// });

// client.connect(function (err) {
//   console.log('ERROR CONNECTING = ', err);
// });



// const query = 'SELECT name, email FROM users WHERE key = ?';

// client.execute(query, [ 'someone' ])
//   .then(result => console.log('User with email %s', result.rows[0].email))