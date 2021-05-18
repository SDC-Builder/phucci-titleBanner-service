const Promise = require('bluebird');
const router = require('express').Router();
let Enrolled = require('../../../db/enrolled.model');
const { exampleEnrolledGenerator } = require('../../example.data');
const faker = require('faker');


//helper function
let saveEnrolled = (cb) => {
  let enrolledData = exampleEnrolledGenerator();

  Enrolled.insertMany(enrolledData)
    .then((seededEnrolled) => cb(null, seededEnrolled))
    .catch((err) => cb(`SEEDING ENROLLMENTS ERROR = ${err}`, null));
};

saveEnrolled = Promise.promisify(saveEnrolled);

let getNextId = (cb) => {
  Enrolled.find().sort({ _id: -1 }).limit(1)
    .then((record) => cb(null, record[0]._id + 1))
    .catch((err) => {
      console.log('ERROR GETTING MOST RECENT ENROLLMENT = ', err);
      cb(err, null);
    });
};

getNextId = Promise.promisify(getNextId);

router.route('/enrolled/').post(async (req, res) => {

  let id = await getNextId();
  let newEnrolled = { _id: id, enrolled: faker.random.number() };

  Enrolled.create(newEnrolled)
    .then((insertedData) => res.send(JSON.stringify(insertedData.enrolled)))
    .catch((err) => res.status(404).send(`failed to get enrollment with id(${req.params.id})`));
});

router.route('/enrolled/:id').get((req, res) => {
  Enrolled.find({ _id: req.params.id })
    .then((data) => res.status(200).json(data[0].enrolled))
    .catch((err) => res.status(400).send(`failed to get enrollment with id(${req.params.id})`));
});

router.route('/enrolled/:id').put((req, res) => {
  Enrolled.updateOne({ _id: req.params.id }, { data: req.body.enrolled })
    .then((succcess) => res.send(`updated enrollment with id(${req.params.id}) to "${req.body.enrolled}"`))
    .catch((err) => res.status(400).send(`failed to update enrollment with id(${req.params.id})`));
});

router.route('/enrolled/:id').delete((req, res) => {
  Enrolled.deleteOne({ _id: req.params.id })
    .then((deleted) => res.status(200).send(`deleted enrollment with id(${req.params.id})`))
    .catch((e) => res.status(400).send(`failted to delete enrollment with id(${req.params.id})`));
});


module.exports.router = router;
module.exports.saveEnrolled = saveEnrolled;