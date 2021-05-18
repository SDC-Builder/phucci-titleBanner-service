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
  let id = 9990000;
  let getQuery = '';
  let record;


  for (let i = 0; i < total; i++) {
    getQuery = `SELECT * FROM tittle WHERE id = ${id += 1}`;
    let start = Date.now();
    record = await client.execute(getQuery);
    let end = Date.now();;
    totalTime += (end - start);
  }

  return [totalTime / total, getQuery, record.rows[0]];
};


const benchMarkCassandra = async () => {
  await benchMarks(benchmarkSelectQueries, 1, false, fileDir, 'cassandra');
};



for (let i = 0; i < 1000; i++) {
  benchMarkCassandra();
}
