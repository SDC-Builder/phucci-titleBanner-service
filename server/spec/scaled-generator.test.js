const generateScaledTittles = require('./../example.data').generateScaledTittles;
const expect = require('chai').expect;


describe('Mass data generator', () => {

  test('should be able to generate .5 million records in 1 call', () => {
    let totalRecords = 10000000;
    let eachBatchCounts = 500000;
    let timesToGenerateTotal = totalRecords / eachBatchCounts;

    let start = Date.now();
    let tittles = generateScaledTittles(0);
    let end = Date.now();

    let minutesToGenerate = (end - start) / 1000 / 60;

    let totalMinutesToGenerate = minutesToGenerate * timesToGenerateTotal;

    expect(tittles.length * timesToGenerateTotal).to.equal(totalRecords);
    expect(minutesToGenerate).to.be.below(1);
    expect(totalMinutesToGenerate).to.be.below(10);
  });

});