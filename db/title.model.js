
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const titleSchema = new Schema({
  _id: Number,
  title: String
});

let Title = mongoose.model('Title', titleSchema);

module.exports = Title;