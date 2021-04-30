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

router.route('/getTitle/:id').get((req, res) => {
  Title.find({id: req.params.id})
    .then((data) => {
      console.log('data = ', data)
      res.status(200).json(data[0].title);
    })
    .catch(err => res.status(400).json(err));
});


//seeding route
router.route('/addTitle/:total').post((req, res) => {
  seed((success) => res.status(200).json('Data seeded successfully'));
});


module.exports.router = router;