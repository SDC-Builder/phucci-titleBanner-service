const faker = require('faker');
const path = require('path');
const fs = require('fs');
const dataDir = path.join(__dirname, 'rawData');

var titleIdCounter = 0;
var enrolledIdCounter = 0;

let exampleDataGenerator = () => {

  let totalTittles = 100;
  let tittleCollection = [];

  while (totalTittles !== 0) {
    titleIdCounter++;

    let tittle = {
      _id: titleIdCounter,
      title: faker.random.words(2)
    };

    tittleCollection.push(tittle);
    totalTittles--;
  }

  return tittleCollection;
};

let generateScaledTittles = (currentCounts) => {

  console.time('generateTittles');
  console.log(`generating tittles...`);

  // half mil
  let totalTittles = 500000;

  let tittleCollection = [];

  while (totalTittles !== 0) {
    currentCounts++;

    let tittle = {
      _id: currentCounts,
      title: faker.random.words(2)
    };

    tittleCollection.push(tittle);
    totalTittles--;
  }

  console.timeEnd('generateTittles');
  console.log('generated tittles = ', tittleCollection);

  return tittleCollection;
};


let exampleEnrolledGenerator = () => {
  let totalEnrollments = 100;

  let enrolledCollection = [];

  while (totalEnrollments !== 0) {
    enrolledIdCounter++;

    let enrollment = {
      _id: enrolledIdCounter,
      enrolled: faker.random.number()
    };

    enrolledCollection.push(enrollment);
    totalEnrollments--;
  }
  return enrolledCollection;
};

const generateTittle = (currentCounts) => {
  let params = [];
  let id = currentCounts;
  let tittle = faker.random.words(2);
  let enrollments = faker.random.number();
  params.push(id, tittle, enrollments);

  return params;
};

const generateCassanInsertQueries = (currentCounts) => {
  let insertQuery = `INSERT INTO tittle (id, tittle, enrollments) VALUES (?, ?, ?)`;

  console.time('generateInsertQueries');
  console.log(`generating tittle queries...`);

  // half mil
  let totalTittles = 1400;
  let queries = [];

  while (totalTittles !== 0) {
    currentCounts++;

    queries.push({
      query: insertQuery,
      params: generateTittle(currentCounts)
    });

    totalTittles--;
  }

  console.timeEnd('generateInsertQueries');
  return queries;
};

module.exports = {
  exampleDataGenerator,
  exampleEnrolledGenerator,
  generateScaledTittles,
  generateCassanInsertQueries
};