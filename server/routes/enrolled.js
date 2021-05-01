const Promise = require('bluebird');
const router = require('express').Router();
let Enrolled = require('../../db/enrolled.model');
const { exampleEnrolledGenerator } = require('../example.data');


//helper function
let saveEnrolled = (cb) => {
  let enrolledData = exampleEnrolledGenerator();

  Enrolled.insertMany(enrolledData)
    .then((seededEnrolled) => cb(null, seededEnrolled))
    .catch((err) => cb(`SEEDING ENROLLMENTS ERROR = ${err}`, null));
};

saveEnrolled = Promise.promisify(saveEnrolled);

router.route('/enrolled/:id').get((req, res) => {
  Enrolled.find({id: req.params.id})
    .then((data) => res.status(200).json(data[0].enrolled))
    .catch((err) => res.status(400).send(`failed to get enrollment with id(${req.params.id})`));
});

router.route('/enrolled/:id').put(async (req, res) => {
  try {
    let record = await Enrolled.findOne({ id: req.params.id });
    record.enrolled = req.body.enrolled;
    await record.save();
    res.send(`updated enrollment with id(${req.params.id}) to "${record.enrolled}"`);

  } catch(e) { res.status(400).send(`failed to update enrollment with id(${req.params.id})`); }
});

router.route('/enrolled/:id').delete((req, res) => {
  Enrolled.deleteOne({ id: req.params.id })
    .then((deleted) => res.status(200).send(`deleted enrollment with id(${req.params.id})`))
    .catch((e) => res.status(400).send(`failted to delete enrollment with id(${req.params.id})`));
});


module.exports.router = router;
module.exports.saveEnrolled = saveEnrolled;