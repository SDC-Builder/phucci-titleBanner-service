const path = require('path');
const db = require('./../index').db;
const pgp = require('pg-promise')();
const Promise = require('bluebird');
const benchMarks = require('./../../benchmarkTools');



let fileDir = path.join(__dirname, 'benchMarkRecord.json');

const benchmarkSelectQueries = async (total) => {

  let totalTime = 0;
  let id = 9999000;

  for (let i = 0; i < total; i++) {
    let getQuery = `SELECT * FROM tittle WHERE id = ${id += i}`;

    let start = Date.now();
    let record = await db.any(getQuery);
    let end = Date.now();

    let time = end - start;
    totalTime += time;
  }

  return totalTime / total;
};

const benchmarkSelectWithOptions = async (total) => {

  let totalTime = 0;
  let id = 9999000;

  for (let i = 0; i < total; i++) {
    let getQuery = "SELECT * FROM tittle WHERE title = 'copying Manager' LIMIT 1";

    let start = Date.now();
    await db.any(getQuery);
    let end = Date.now();;

    totalTime += (end - start);
  }

  return totalTime / total;
};


const benchMarkPostgres = async () => {
  // await benchMarks(benchmarkSelectWithOptions, 3, true, fileDir, 'postgres');
  await benchMarks(benchmarkSelectQueries, 1, false, fileDir, 'postgres');
  await benchMarks(benchmarkSelectQueries, 3, false, fileDir, 'postgres');
  await benchMarks(benchmarkSelectQueries, 10, false, fileDir, 'postgres');
  await benchMarks(benchmarkSelectQueries, 100, false, fileDir, 'postgres');
  await benchMarks(benchmarkSelectQueries, 1000, false, fileDir, 'postgres');
};


benchMarkPostgres();





