const router = require('express').Router();
const Promise = require('bluebird');
const faker = require('faker');


let Title = require('../../db/title.model');
const mongoose = require('mongoose');
const saveEnrolled = require('./enrolled').saveEnrolled;
const exampleDataGenerator = require('../example.data').exampleDataGenerator;

mongoose.connect('mongodb://localhost:27017/tittle');

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
    await saveEnrolled().then((enrolled) => console.log('seeded enrollment = ', enrolled));
    console.log('data successfully seeded');
    cb('data seeded');

  } catch(e) { }
};

let seedIfEmpty = () => Title.findOne({})
  .then((tittle) => !tittle ? seed() : null);

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


module.exports.router = router;
module.exports.seedIfEmpty = seedIfEmpty;