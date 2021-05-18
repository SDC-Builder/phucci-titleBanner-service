const router = require('express').Router();
const Promise = require('bluebird');
const faker = require('faker');
const axios = require('axios');
let seedUri = 'http://localhost:3001/api/mongo/scaled-seed/';


let Title = require('../../../db/title.model');
const mongoose = require('mongoose');
const saveEnrolled = require('./enrolled').saveEnrolled;
const generator = require('../../example.data');


let saveTittle = (cb) => {
  let tittleData = generator.exampleDataGenerator();

  Title.insertMany(tittleData)
    .then((seededData) => cb(null, seededData))
    .catch((err => cb(`SEEDING TITTLES ERROR = ${err}`, null)));
};
saveTittle = Promise.promisify(saveTittle);


const scaledSeed = async (currentCounts) => {
  let tittleData = generator.generateScaledTittles(currentCounts);
  console.log('writting tittles to db...');

  try {
    let seededData = await Title.insertMany(tittleData).then((seededTittles) => console.log('data successfully seeded \n'));
    return Promise.resolve(seededData);

  } catch (err) { return Promise.resolve(`SEEDING TITTLES ERROR = ${err}`); }
};


let seed = async (cb) => {
  try {
    saveTittle().then((seededTittles) => console.log('seededTittles = ', seededTittles));
    await saveEnrolled().then((enrolled) => console.log('seeded enrollment = ', enrolled));
    console.log('data successfully seeded');
    cb(null, 'data seeded');

  } catch(e) { cb(e, null); }
};
seed = Promise.promisify(seed);



const getNextId = async () => {
  try {
    let record = await Title.find().sort({ _id: -1 }).limit(1);
    return Promise.resolve(record[0]._id + 1);

  } catch (err) { return Promise.reject(`ERROR GETTING MOST RECENT RECORD = ${err}`); }
};


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


router.route('/mongo/scaled-seed/:currentCounts').post((req, res) => {
  console.log('req.params.currentCounts = ', req.params.currentCounts);
  let totalTittles = 26000000;
  if (req.params.currentCounts > totalTittles) { return res.status(400).json(`Exceeded max number of tittles(${totalTittles})`); }

  scaledSeed(req.params.currentCounts).then(async (success) => {
    let lastRecord = await Title.find().sort({ _id: -1 }).limit(1);
    let currentCounts = lastRecord[0]._id;

    if (currentCounts < totalTittles) {
      res.status(201).json('Data seeded successfully');
      return axios.post(seedUri + currentCounts);
    }
    return res.status(201).json('Data seeded successfully');
  });
});

module.exports.router = router;
module.exports.seed = seed;