const fs = require('fs');
const path = require('path');
const cassandra = require('cassandra-driver');
const client = new cassandra.Client({
  contactPoints: ['127.0.0.1'],
  localDataCenter: 'datacenter1',
  keyspace: 'tittle'
});

const benchMarks = require('./../../benchmarkTools');
const fileDir = path.join(__dirname, 'benchMarkRecord.json');


const benchmarkSelectQueries = async (total) => {

  let totalTime = 0;
  let id = 9999000;

  for (let i = 0; i < total; i++) {
    let getQuery = `SELECT * FROM tittle WHERE id = ${id += i}`;

    let start = Date.now();
    let record = await client.execute(getQuery);
    let end = Date.now();;
    totalTime += (end - start);
  }

  return totalTime / total;
};


const benchMarkCassandra = () => {
  benchMarks(benchmarkSelectQueries, 1000, false, fileDir, 'cassandra');
};

benchMarkCassandra();