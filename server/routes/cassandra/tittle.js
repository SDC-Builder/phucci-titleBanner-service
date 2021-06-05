const router = require('express').Router();
const Promise = require('bluebird');
const axios = require('axios');
const cassandra = require('cassandra-driver');
let seedUri = 'http://localhost:3001/api/cassandra/scaled-seed/';
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
  .then(() => newCounts)
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

let currentCount;

getCounts().then((count) => {
  currentCount = count;
  console.log('currentCount = ', currentCount);
});


const insert = async ({ title, enrollments }) => {
  let insertQuery = `INSERT INTO tittle (id, tittle, enrollments) VALUES (?, ?, ?)`;

  try {
    await client.execute(insertQuery, [currentCount += 1, title, enrollments], { prepare: true });
    updateCounts(currentCount);
    return Promise.resolve(`New title "${title} successfully added"`);

  } catch(e) { return `ERROR INSERTING RECORD WITH TITLE "${title}" = ${e}`; }

};

const getRecord = async (id) => {
  let query = 'SELECT * FROM tittle WHERE id = 9000000 LIMIT 1';

  try {
    let response = await client.execute(query, [id], { prepare: true });
    return Promise.resolve(response.rows[0]);

  } catch(e) { return `ERROR GETTING TITLE = ${e}`; }
}


router.route('/title/').post(async (req, res) => {
  try {
    let response = await insert(req.body);
    res.send('success');

  } catch(e) {
    console.log('ERROR POSTING NEW TITLE = ', e);
    res.status(400);
  }
});


router.route('/title/:id').get(async (req, res) => {
  try {
    let data = await getRecord(req.params.id);
    return res.send(data);

  } catch(e) {
    console.log('ERROR GETTING TITLE = ', e);
    return res.status(400);
  }
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
