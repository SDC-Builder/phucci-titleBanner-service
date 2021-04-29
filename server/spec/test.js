var assert = require('chai').assert;
var expect = require('chai').expect;
var { exampleDataGenerator } = require('../example.data');
var { exampleEnrolledGenerator } = require('../example.data');

(function() {
  describe('Seeding Tests', function() {

    describe('returns a string', function() {

      it('Seeding generator should generate title strings', function() {
        var tittleCollection = exampleDataGenerator();
        expect(typeof tittleCollection[99].title).to.equal('string');
      });
    });

    describe('returns an array of title names', function() {
      it('Seeding generator return array of length inputted by user', function() {
        var tittleCollection = exampleDataGenerator();
        expect(tittleCollection.length).to.equal(100);
      });
    });

    describe('returns a number for total Enrolled', function() {
      it('Seeding generator return a number for total enrolled in a course', function() {
        var totalEnrolled = exampleEnrolledGenerator();
        expect(typeof totalEnrolled[99].enrolled).to.equal('number');
      });
    });
  });
}());
