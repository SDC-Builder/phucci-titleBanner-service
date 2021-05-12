const selectQueriesAverageInMillis = require('./../../db/cassandra/benchmark/benchMarkRecord').selectAverage;
const expect = require('chai').expect;

describe('Cassandra select queries average in ms for 1000 queries', () => {
  test('average time for each select query should be under 5ms', () => {
    expect(selectQueriesAverageInMillis).to.be.below(5)
  });
});