const path = require('path');
const db = require('./../index').db;
const pgp = require('pg-promise')();
const Promise = require('bluebird');
const benchMarks = require('./../../benchmarkTools');



let fileDir = path.join(__dirname, 'benchMarkRecord.json');

const benchmarkSelectQueries = async (total) => {

  let totalTime = 0;
  let id = 9990000;
  let getQuery = '';
  let record;

  for (let i = 0; i < total; i++) {
    getQuery = `SELECT * FROM tittle WHERE id = ${id += 1}`;

    let start = Date.now();
    record = await db.any(getQuery);
    let end = Date.now();

    let time = end - start;
    totalTime += time;
  }

  return [totalTime / total, getQuery, record[0]];
};

const benchmarkSelectWithOptions = async (total) => {

  let totalTime = 0;
  let id = 9999000;
  let getQuery = "SELECT * FROM tittle WHERE title = 'copying Manager' LIMIT 1";
  let record;

  for (let i = 0; i < total; i++) {

    let start = Date.now();
    record = await db.any(getQuery);
    let end = Date.now();;

    totalTime += (end - start);
  }

  console.log('record = ', record);
  return [totalTime / total, getQuery, record];
};


const benchMarkPostgres = async () => {
  await benchMarks(benchmarkSelectQueries, 1, false, fileDir, 'postgres');
};

for (let i = 0; i < 1000; i++) {
  benchMarkPostgres();
}
