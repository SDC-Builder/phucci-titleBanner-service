const expect = require('chai').expect;
const axios = require('axios');
const uri = 'http://localhost:3001/api/tittle';
const server = require('./../index.js').server;
const mongoose = require('./../index.js').mongoose;

const Tittle = require('./../../db/title.model');

const seedIfEmpty = require('./../routes/title').seedIfEmpty;


beforeAll(async (done) => {
  await seedIfEmpty();
  done();
});

afterAll(async (done) => {
  await mongoose.connection.close();
  await server.close();
  done();
});

describe('CRUD endpoints', () => {
  test('should be able to insert new tittle it into db', async () => {
    let oldCount = await Tittle.count();

    let newTittle = await axios.post(uri);
    let newCount = await Tittle.count();

    expect(newTittle.data).to.be.a('string');
    expect(newCount).to.equal(oldCount + 1);

    // Restore
    await Tittle.deleteOne({ _id: newCount });
  });

  test('should be able to retrieve a tittle with provided id', async () => {
    let providedId = 23;

    let retrievedTittle = await axios.get(`${uri}/${providedId}`);
    expect(retrievedTittle.data).to.be.a('string');

    let queriedId = await Tittle.findOne({ title: retrievedTittle.data });
    expect(queriedId._id).to.equal(providedId);
  });

  test('should be able to update a tittle with provided id', async () => {
    let providedId = 37;

    let newTittle = 'test tittle';
    let oldTittle = await Tittle.findOne({ _id: providedId });
    expect(oldTittle.title).to.not.equal(newTittle);

    let updatedTittle = await axios.put(`${uri}/${providedId}`, { tittle: newTittle });
    expect(updatedTittle.data).to.have.string(newTittle);

    // Restore
    await Tittle.updateOne({ _id: providedId }, { data: oldTittle.title });
  });

  test('should be able to delete a tittle with provided id', async () => {
    let providedId = 99;

    let tittleToDelete = await Tittle.findOne({ _id: providedId });
    expect(tittleToDelete.title).to.be.a('string');

    await axios.delete(`${uri}/${providedId}`);
    let deletedTittle = await Tittle.findOne({ _id: providedId });
    expect(deletedTittle).to.equal(null);

    // Restore
    await Tittle.create({ _id: providedId, title: tittleToDelete.title});
  });
});