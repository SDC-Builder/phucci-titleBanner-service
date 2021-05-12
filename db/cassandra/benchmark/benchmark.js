const fs = require('fs');
const path = require('path');
const cassandra = require('cassandra-driver');
const client = new cassandra.Client({
  contactPoints: ['127.0.0.1'],
  localDataCenter: 'datacenter1',
  keyspace: 'tittle'
});

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
    let record = await client.execute(getQuery);

    let end = Date.now();;
    totalTime += (end - start);
    console.log('get = ', end - start);
  }

  return totalTime / 1000;
};

const benchMarks = async () => {

  await client.connect();

  let benchMarkRecord = '';
  let totalSelectQueries = 1000;
  let selectInMillisAverage = await benchmarkSelectQueries(totalSelectQueries);

  console.log('averange = ', selectInMillisAverage);
  benchMarkRecord += `let selectQueriesAverangeInMillis = ${selectInMillisAverage};\n`;

  persistBenchmarkRecord(benchMarkRecord);
};

benchMarks();