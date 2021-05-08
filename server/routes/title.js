const router = require('express').Router();
const Promise = require('bluebird');
const faker = require('faker');
const axios = require('axios');
let seedUri = 'http://localhost:3001/api/scaled-seed/';


let Title = require('../../db/title.model');
const mongoose = require('mongoose');
const saveEnrolled = require('./enrolled').saveEnrolled;
const generator = require('../example.data');


let saveTittle = (cb) => {
  let tittleData = generator.exampleDataGenerator();

  Title.insertMany(tittleData)
    .then((seededData) => cb(null, seededData))
    .catch((err => cb(`SEEDING TITTLES ERROR = ${err}`, null)));
};
saveTittle = Promise.promisify(saveTittle);


let writeScaledTittles = (currentCounts, cb) => {
  let tittleData = generator.generateScaledTittles(currentCounts);
  console.log('writting tittles to db...');

  Title.insertMany(tittleData)
    .then((seededData) => cb(null, seededData))
    .catch((err => cb(`SEEDING TITTLES ERROR = ${err}`, null)));
};
writeScaledTittles = Promise.promisify(writeScaledTittles);


let scaledSeed = async (currentCounts, cb) => {
  console.time('seed');

  try {
    await writeScaledTittles(currentCounts).then((seededTittles) => console.log('seededTittles = ', seededTittles));
    console.timeEnd('seed');
    console.log('data successfully seeded');
    cb(null, 'data seeded');

  } catch(e) { cb(e, null); }
};
scaledSeed = Promise.promisify(scaledSeed);


let seed = async (cb) => {
  try {
    saveTittle().then((seededTittles) => console.log('seededTittles = ', seededTittles));
    await saveEnrolled().then((enrolled) => console.log('seeded enrollment = ', enrolled));
    console.log('data successfully seeded');
    cb(null, 'data seeded');

  } catch(e) { cb(e, null); }
};
seed = Promise.promisify(seed);



let getNextId = (cb) => {
  Title.find().sort({ _id: -1 }).limit(1)
    .then((record) => cb(null, record[0]._id + 1))
    .catch((err) => {
      console.log('ERROR GETTING MOST RECENT RECORD = ', err);
      cb(err, null);
    });
};

getNextId = Promise.promisify(getNextId);

router.route('/tittle/').post(async (req, res) => {

  let id = await getNextId();
  let newTittle = { _id: id, title: faker.random.words(2) };

  Title.create(newTittle)
    .then((insertedData) => res.send(insertedData.title))
    .catch((err) => res.status(400).send(`failed to get tittle with id(${req.params.id})`));
});


router.route('/tittle/:id').get((req, res) => {
  Title.find({ _id: req.params.id })
    .then((record) => res.send(record[0].title))
    .catch((err) => res.status(400).send(`failed to get tittle with id(${req.params.id})`));
});

router.route('/tittle/:id').put((req, res) => {
  Title.updateOne({ _id: req.params.id }, { data: req.body.tittle })
    .then((succcess) => res.send(`updated tittle with id(${req.params.id}) to "${req.body.tittle}"`))
    .catch((err) => res.status(400).send(`failed to update tittle with id(${req.params.id})`));
});

router.route('/tittle/:id').delete((req, res) => {
  Title.deleteOne({ _id: req.params.id })
    .then((deleted) => res.status(200).send(`deleted tittle with id(${req.params.id})`))
    .catch((e) => res.status(400).send(`failted to delete tittle with id(${req.params.id})`));
});


//seeding route
router.route('/seed').post((req, res) => {
  seed((success) => res.status(200).json('Data seeded successfully'));
});


router.route('/scaled-seed/:currentCounts').post(async (req, res) => {

  let totalTittles = 11000000;
  if (req.params.currentCounts > totalTittles) { return res.status(400).json(`Exceeded max number of tittles(${totalTittles})`); }

  scaledSeed(req.params.currentCounts, async (success) => {
    let lastRecord = await Title.find().sort({ _id: -1 }).limit(1);
    let currentCounts = lastRecord[0]._id;

    if (currentCounts < totalTittles) {
      res.status(201).json('Data seeded successfully');
      return axios.post(seedUri += currentCounts);
    }
    res.status(201).json('Data seeded successfully');
  });
});

module.exports.router = router;
module.exports.seed = seed;