const filesystem = require('fs');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(filesystem);

const persistBenchmarkRecord = async (timeInMs, option, fileName) => {

  try {
    let data = await fs.readFileAsync(fileName);
    let record = JSON.parse(data.toString());
    if (option) { record.selectQueriesAverangeWithOption = timeInMs; }
    if (!option) { record.selectQueriesAverange = timeInMs; }
    await fs.writeFileAsync(fileName, JSON.stringify(record));

  } catch(err) { console.log('ERROR PERSISTING RECORD = ', err); }

};

const benchMarks = async (benchmarkQueries, totalQueries, option, fileName, dbName) => {

  let start = Date.now();
  let [selectInMillisAverage, query, record] = await benchmarkQueries(totalQueries);

  let end = Date.now();

  if (option) {  console.log(`benchmarking ${dbName} for "${totalQueries} queries" (with option)`); }
  if (!option) {  console.log(`benchmarking ${dbName} for "${totalQueries} queries" (without option)`); }

  console.log('last query = ', query);
  console.log(`totalTime =  ${(end - start)} ms`);
  console.log(`average = ${selectInMillisAverage} ms`);
  console.log('last queried record = ', record);
  console.log('');

  Promise.resolve(persistBenchmarkRecord(selectInMillisAverage, option, fileName));
};


module.exports = benchMarks;