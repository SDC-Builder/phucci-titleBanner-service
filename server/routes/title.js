const router = require('express').Router();

let Title = require('../../db/title.model');
const mongoose = require('mongoose');

const dataGeneratorFunction = require('../example.data');

//helper function
let saveTile = (randomData, cb) => {
  var titleArray = randomData[0].titleName;
  var idArray = randomData[0].id;
  titleArray.forEach((data, index) => {
    const title = data;
    const id = String(idArray[index]);

    Title.findOne({title: title}, (err, data) => {
      if (err) { console.log(err); }
      if (data) {
        cb(`${title} already exists in db`);
      } else {
        const repo = new Title({
          id,
          title
        });
        repo.save()
          .then((title) => cb(title))
          .catch(err => cb(err));
      }
    });
  });
};

router.route('/getTitle/:id').get((req, res) => {
  Title.find({id: req.params.id})
    .then(data => {
      res.status(200).json(data[0].title);
    })
    .catch(err => res.status(400).json(err));
});


//seeding route
router.route('/addTitle/:total').post((req, res) => {
  var titleName = dataGeneratorFunction.exampleDataGenerator(req.params.total);

  saveTile(titleName, (data, err) => {
    if (err) {
      res.status(400).json(err);
    } else {
      console.log('Titles added successfully', data.title);
      // mongoose.connection.close();
    }
  });
  res.status(200).json('Added title names successfully');
});




module.exports = router;