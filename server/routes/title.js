const router = require('express').Router();
const Promise = require('bluebird');

let Title = require('../../db/title.model');
const mongoose = require('mongoose');
const saveEnrolled = require('./enrolled').saveEnrolled;
const exampleDataGenerator = require('../example.data').exampleDataGenerator;


let saveTittle = (cb) => {
  let tittleData = exampleDataGenerator();

  Title.insertMany(tittleData)
    .then((seededData) => cb(null, seededData))
    .catch((err => cb(`SEEDING TITTLES ERROR = ${err}`, null)));
};

saveTittle = Promise.promisify(saveTittle);

const seed = async (cb) => {
  try {
    saveTittle().then((seededTittles) => console.log('seededTittles = ', seededTittles));
    await saveEnrolled().then((enrolled) => console.log('seeded enrollment = ', enrolled))
    cb('data seeded');

  } catch(e) { }
};

router.route('/tittle/:id').get((req, res) => {
  Title.find({ id: req.params.id })
    .then((record) => res.send(record[0].title))
    .catch((err) => res.status(400).send(`failed to get tittle with id(${req.params.id})`));
});

router.route('/tittle/:id').put((req, res) => {
  Title.updateOne({ id: req.params.id })
    .then((succcess) => res.send(`updated tittle with id(${req.params.id}) to "${req.body.enrolled}"`))
    .catch((err) => res.status(400).send(`failed to update tittle with id(${req.params.id})`));
});

router.route('/tittle/:id').delete((req, res) => {
  Title.deleteOne({ id: req.params.id })
    .then((deleted) => res.status(200).send(`deleted tittle with id(${req.params.id})`))
    .catch((e) => res.status(400).send(`failted to delete tittle with id(${req.params.id})`));
});


//seeding route
router.route('/tittle').post((req, res) => {
  seed((success) => res.status(200).json('Data seeded successfully'));
});


module.exports.router = router;