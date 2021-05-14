const fs = require('fs');
const path = require('path');
const db = require('./../index').db;
const pgp = require('pg-promise')();

const persistBenchmarkRecord = async (benchMarkRecord) => {
  let fileName = path.join(__dirname, 'benchMarkRecord.js');
  benchMarkRecord += `module.exports.selectAverage = selectQueriesAverangeInMillis;`

  await fs.writeFile(fileName, benchMarkRecord, (err) => {
    if (err) { return console.log('ERROR WRITING FILE = ', err); }
    console.log('Select Queries Average Written to file');
  })
};


const benchmarkSelectQueries = async (total) => {

  let totalTime = 0;
  let id = 9999000;

  for (let i = 0; i < total; i++) {
    let getQuery = `SELECT * FROM tittle WHERE id = ${id += i}`;

    let start = Date.now();
    await db.any(getQuery);

    let end = Date.now();;
    totalTime += (end - start);
  }

  return totalTime / 1000;
};


const benchMarks = async () => {

  let benchMarkRecord = '';
  let totalSelectQueries = 1000;

  console.time('benchMarks');
  let selectInMillisAverage = await benchmarkSelectQueries(totalSelectQueries);
  console.timeEnd('benchMarks');


  console.log('averange = ', selectInMillisAverage);
  benchMarkRecord += `let selectQueriesAverangeInMillis = ${selectInMillisAverage};\n`;

  persistBenchmarkRecord(benchMarkRecord);
};


benchMarks();

