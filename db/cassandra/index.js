const cassandra = require('cassandra-driver');
const client = new cassandra.Client({
  contactPoints: ['3.101.75.184'],
  localDataCenter: 'datacenter1',
  credentials: { username: 'cassandra', password: 'cassandra' }
});

const database = 'tittle';
const table = 'tittle';
// const db = new cassandra.Client({
//   contactPoints: ['127.0.0.1'],
//   localDataCenter: 'datacenter1',
//   keyspace: 'tittle'
// });

const db = {};

const configDb = () => {
  return client.connect()
    .then(() => console.log('cass connected'));

  // return client.connect()
  //   .then(() => client.execute(`
  //     CREATE KEYSPACE IF NOT EXISTS ${database}
  //       WITH replication = {
  //         'class': 'SimpleStrategy',
  //         'replication_factor': '1'
  //       };`
  //   ))
  //   .then(() => client.execute(`
  //     CREATE TABLE IF NOT EXISTS ${database}.${table} (
  //       id bigint,
  //       tittle text,
  //       enrollments int,
  //       PRIMARY KEY(id,tittle));`
  //   ))
  //   .then(() => client.execute(`
  //     CREATE TABLE IF NOT EXISTS ${database}.counts (
  //       id int,
  //       count bigint,
  //       PRIMARY KEY(id)
  //     );`
  //   ))
  //   .then(() => client.execute(`USE ${database}`))
  //   .then(() => console.log(`Key space: "${database}" and table: "${table}" has been created for Cassandra`))
  //   .catch((err) => console.log('ERROR CONFIGURING = ', err));
}

module.exports.configDb = configDb;
module.exports.db = db;