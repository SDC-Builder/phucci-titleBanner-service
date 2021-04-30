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

router.route('/tittle/:id').get(async (req, res) => {
  try {
    let record = await Title.find({ id: req.params.id });
    res.send(record[0].title);;

  } catch(e) { res.status(400).send(`failed to get tittle with id(${req.params.id})`); }
});

router.route('/tittle/:id').put(async (req, res) => {
  try {
    let record = await Title.findOne({ id: req.params.id });
    record.title = req.body.tittle;
    await record.save();
    res.send(`updated tittle with id(${req.params.id}) to "${record.title}"`);

  } catch(e) { res.status(400).send(`failed to update tittle with id(${req.params.id})`); }
});

router.route('/tittle/:id').delete(async (req, res) => {
  try {
    let deletedRecord = await Title.deleteOne({ id: req.params.id });
    console.log('deletedRecord = ', deletedRecord);
    res.status(200).send(`deleted tittle with id(${req.params.id})`);

  } catch(e) { res.status(400).send(`failted to delete tittle with id(${req.params.id})`); }
});


//seeding route
router.route('/tittle').post((req, res) => {
  seed((success) => res.status(200).json('Data seeded successfully'));
});


module.exports.router = router;