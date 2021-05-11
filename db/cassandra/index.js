const cassandra = require('cassandra-driver');
const client = new cassandra.Client({ contactPoints: ['127.0.0.1'], localDataCenter: 'datacenter1' });
const database = 'tittle';
const table = 'tittle';

const configDb = () => {
  return client.connect()
    .then(() => client.execute(`
      CREATE KEYSPACE IF NOT EXISTS ${database}
        WITH replication = {
          'class': 'SimpleStrategy',
          'replication_factor': '1'
        };`
    ))
    .then(() => client.execute(`
      CREATE TABLE IF NOT EXISTS ${database}.${table} (
        id bigint,
        tittle text,
        enrollments int,
        PRIMARY KEY(id,tittle));`
    ))
    .then(() => client.execute(`
      CREATE TABLE IF NOT EXISTS ${database}.counts (
        id int,
        count bigint,
        PRIMARY KEY(id)
      );`
    ))
    .then(() => client.execute(`USE ${database}`))
    .then(() => console.log(`Key space: "${database}" and table: "${table}" has been created`))
    .catch((err) => console.log('ERROR CONFIGURING = ', err));
}

module.exports = configDb;