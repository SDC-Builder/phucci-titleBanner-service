const Promise = require('bluebird');
const router = require('express').Router();
let Enrolled = require('../../db/enrolled.model');
const { exampleEnrolledGenerator } = require('../example.data');


//helper function
let saveEnrolled = (cb) => {
  let enrolledData = exampleEnrolledGenerator();

  Enrolled.insertMany(enrolledData)
    .then((seededEnrolled) => cb(null, seededEnrolled))
    .catch((err) => cb(err, null));
};

saveEnrolled = Promise.promisify(saveEnrolled);


router.route('/getEnrolled/:id').get((req, res) => {
  Enrolled.find({id: req.params.id})
    .then(data => res.status(200).json(data[0].enrolled))
    .catch(err => res.status(404).json(err));
});


module.exports.router = router;
module.exports.saveEnrolled = saveEnrolled;