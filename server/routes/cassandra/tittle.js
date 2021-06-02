const router = require('express').Router();
const Promise = require('bluebird');
const axios = require('axios');
const cassandra = require('cassandra-driver');
let seedUri = 'http://localhost:3001/api/cassandra/scaled-seed/';
let postUri = 'http://localhost:3001/api/title/';
// const client = new cassandra.Client({
//   contactPoints: ['127.0.0.1'],
//   localDataCenter: 'datacenter1',
//   keyspace: 'tittle'
// });
const generateCassanInsertQueries = require('../../example.data').generateCassanInsertQueries;
const client = require('./../../../db/cassandra/index').db;
const faker = require('faker');



let scaledSeed = async (currentCounts) => {
  console.time('seed');
  let tittleQueries = generateCassanInsertQueries(currentCounts);
  console.log('writting tittles to db...');

  try {
    await client.batch(tittleQueries, { prepare: true });
    let newCounts = Number(currentCounts) + 1400;
    await updateCounts(newCounts);


    console.timeEnd('seed');
    console.log('data success fully seeded \n');
    return Promise.resolve(newCounts);
  }
  catch (e) { return Promise.reject(`SEEDING TITTLES ERROR = ${e}`); }
};


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

const insert = async (id) => {
  let queries = [];
  let insertQuery = `INSERT INTO tittle (id, tittle, enrollments) VALUES (?, ?, ?)`;
  let updateQuery = 'INSERT INTO counts (id, count) VALUES (?, ?)';

  let title = faker.random.words(2);
  let enrollments = faker.random.number();

  let insertRecord = { query: insertQuery, params: [id, title, enrollments] };
  let updateCount = { query: updateQuery, params: [1, id] };

  queries.push(insertRecord, updateCount);

  try {
    await client.batch(queries, { prepare: true });
    return Promise.resolve(`New tittle with id "${id} successfully added"`);

  } catch(e) { return `ERROR INSERTING RECORD WITH ID "${id}" = ${e}`; }

};


router.route('/title/').post(async (req, res) => {
  try {
    // console.log('req.params.id = ', req.params.id);
    // let response = await insert(req.params.id);
    // console.log('response = ', response);
    console.log('req.body = ', req.body);
    res.send('success');

  } catch(e) {
    console.log('ERROR POSTING NEW TITLE = ', e);
    res.status(400);
    // return axios.post(`${postUri}${req.params.id}`);
  }
});

router.route('/title/:id').get(async (req, res) => {
  console.log('req.params.id = ', req.params.id);
  let query = 'SELECT * FROM tittle WHERE id = ?';
  let params = [req.params.id];
  let response = await client.execute(query, params, { prepare: true });
  let data = response.rows[0];
  console.log('response = ', response);
  console.log('data = ', data);
});



router.route('/cassandra/scaled-seed/:currentCounts').post((req, res) => {
  console.log('req.params.currentCounts = ', req.params.currentCounts);
  let totalTittles = 14000000;

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
