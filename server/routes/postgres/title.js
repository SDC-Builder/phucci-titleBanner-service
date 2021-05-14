const router = require('express').Router();
const Promise = require('bluebird');
const axios = require('axios');
let seedUri = 'http://localhost:3001/api/postgres/scaled-seed/';
const { generatePostgresTitles } = require('../../example.data');
const pgp = require('pg-promise')();
const db = require('./../../../db/postgres/index').db;

const cs = new pgp.helpers.ColumnSet([
  'id',
  'title',
  'enrollments'
], {table: 'tittle'});


let writeScaledTittles = async (currentCounts) => {
  let titles = generatePostgresTitles(currentCounts);
  console.log('writting titles to db...');

  try {
    let insert = pgp.helpers.insert(titles, cs);
    await db.none(insert);

    let newCounts = Number(currentCounts) + 500000;
    return Promise.resolve(newCounts);
  }
  catch (e) { return Promise.reject(`SEEDING TITLES ERROR = ${e}`); }
};


let scaledSeed = async (currentCounts) => {
  console.time('seed');
    try {
      let newCounts = await writeScaledTittles(currentCounts);
      console.timeEnd('seed');
      console.log('data success fully seeded \n');
      return Promise.resolve(newCounts);

    } catch(e) {
      console.log('ERROR WRITING TO DB = ', e);
      return Promise.reject(e)
    }
};


router.route('/postgres/scaled-seed/:currentCounts').post((req, res) => {
  console.log('req.params.currentCounts = ', req.params.currentCounts);
  let totalTittles = 10000000;

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
