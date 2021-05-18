const expect = require('chai').expect;
const filesystem = require('fs');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(filesystem);
const path = require('path');
const cassandraBenchMarkDir = path.join(__dirname, '../../db/cassandra/benchmark/benchMarkRecord.json');
const postgresBenchMarkDir = path.join(__dirname, '../../db/cassandra/benchmark/benchMarkRecord.json');


describe('SELECT queries average with no option in ms for 1000 queries', () => {
  test('average time for 1000 SELECT queries for Cassandra should be under 2ms', async () => {
    let buffer = await fs.readFileAsync(cassandraBenchMarkDir);
    let record = JSON.parse(buffer.toString());
    let selectQueriesAverageInMillis = record.selectQueriesAverange;

    expect(selectQueriesAverageInMillis).to.be.below(2);
  });

  test('average time for 1000 SELECT queries for Postgres should be under 2ms', async () => {
    let buffer = await fs.readFileAsync(postgresBenchMarkDir);
    let record = JSON.parse(buffer.toString());
    let selectQueriesAverageInMillis = record.selectQueriesAverange;

    expect(selectQueriesAverageInMillis).to.be.below(2);
  });
});