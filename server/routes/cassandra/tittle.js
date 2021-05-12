const router = require('express').Router();
const Promise = require('bluebird');
const axios = require('axios');
const cassandra = require('cassandra-driver');
let seedUri = 'http://localhost:3001/api/cassandra/scaled-seed/';
const client = new cassandra.Client({
  contactPoints: ['127.0.0.1'],
  localDataCenter: 'datacenter1',
  keyspace: 'tittle'
});
const generateCassanInsertQueries = require('../../example.data').generateCassanInsertQueries



let writeScaledTittles = (currentCounts, cb) => {
  let tittleQueries = generateCassanInsertQueries(currentCounts);
  console.log('writting tittles to db...');

  client.batch(tittleQueries, { prepare: true })
    .then(() => {
      let newCounts = Number(currentCounts) + 1400;
      cb(null, newCounts);
    })
    .catch((err) => cb(`SEEDING TITTLES ERROR = ${err}`, null))
};
writeScaledTittles = Promise.promisify(writeScaledTittles);

const updateCounts = (newCounts) => {
  client.execute(`INSERT INTO counts (id, count)
    VALUES (1, ${newCounts})`)
  .then(() => console.log('newCounts updated = ', newCounts))
  .catch((err) => console.log('ERROR UPDATING COUNT = ', err));
};

const getCounts = async () => {
  let record = await client.execute(`SELECT count
    FROM counts
    WHERE id = 1
    LIMIT 1;`);

  let counts = record.rows[0].count.low;
  return counts;
};


let scaledSeed = async (currentCounts, cb) => {
  console.time('seed');

  try {
    let newCounts = await writeScaledTittles(currentCounts);
    console.timeEnd('seed');
    console.log('data success fully seeded \n');

    await updateCounts(newCounts);
    cb(null, newCounts);

  } catch(e) {
    console.log('ERROR WRITING TO DB = ', e);
    cb(e, null);
  }
};
scaledSeed = Promise.promisify(scaledSeed);

router.route('/cassandra/scaled-seed/:currentCounts').post((req, res) => {
  console.log('req.params.currentCounts = ', req.params.currentCounts);
  let totalTittles = 13000000;

  if (req.params.currentCounts > totalTittles) { return res.status(400).json(`Exceeded max number of tittles(${totalTittles})`); }

  scaledSeed(req.params.currentCounts).then(async (newCounts) => {
    let currentCounts = newCounts;

    if (currentCounts < totalTittles) {
      res.status(201).json('Data seeded successfully');
      return axios.post(seedUri + currentCounts);
    }
    return res.status(201).json('Data seeded successfully');
  });

});

module.exports.router = router;
