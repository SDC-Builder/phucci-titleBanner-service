const faker = require('faker');
var titleIdCounter = 0;
var enrolledIdCounter = 0;

let exampleDataGenerator = () => {
  let totalTittles = 100;
  let tittleCollection = [];

  while (totalTittles !== 0) {
    titleIdCounter++;

    let tittle = {
      id: titleIdCounter,
      title: faker.random.words(2)
    };

    tittleCollection.push(tittle);
    totalTittles--;
  }

  return tittleCollection;
};

let exampleEnrolledGenerator = () => {
  let totalEnrollments = 100;
  let enrolledCollection = [];

  while (totalEnrollments !== 0) {
    enrolledIdCounter++;

    let enrollment = {
      id: enrolledIdCounter,
      enrolled: faker.random.number()
    };

    enrolledCollection.push(enrollment);
    totalEnrollments--;
  }
  return enrolledCollection;
};

module.exports = {
  exampleDataGenerator,
  exampleEnrolledGenerator
};