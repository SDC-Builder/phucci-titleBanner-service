const pgp = require('pg-promise')();
const dbName = 'tittle';
const table = 'tittle';
const db = pgp(`postgres://postgres@localhost:5432/${dbName}`);

const verifyConnection = async () => {
  const c = await db.connect();
  console.log(`Succesfully connected to Postgres "${dbName}" database v${c.client.serverVersion}`);
  c.done(); // success, release connection
}

db.any(`
  CREATE TABLE IF NOT EXISTS ${table} (
    id BIGINT PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    enrollments INT
  )`)
.then(() => console.log(`Table "${table}" has been created`))
.catch((err) => console.log(`ERROR CREATING TABLE = `, err));


module.exports.db = db;
module.exports.connection = verifyConnection;

