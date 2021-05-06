const expect = require('chai').expect;
const axios = require('axios');
const tittleUri = 'http://localhost:3001/api/tittle';
const enrolledUri = 'http://localhost:3001/api/enrolled';

const app = require('./../server.js');
const dbName = 'testTittle';

const Tittle = require('./../../db/title.model');
const Enrolled = require('./../../db/enrolled.model');
const seed = require('./../routes/title').seed;


app.db.connect(`mongodb://localhost:27017/${dbName}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.db.connection.once('open', _ => {
  console.log(`mongo connected to "${dbName} db`);
});


beforeAll(async (done) => {
  await seed();
  done();
});

afterAll(async (done) => {
  await app.db.connection.close();
  await app.server.close();
  done();
});

describe('CRUD for tittles', () => {
  test('should be able to insert new tittle it into db', async () => {
    let oldCount = await Tittle.count();

    let newTittle = await axios.post(tittleUri);
    let newCount = await Tittle.count();

    expect(newTittle.data).to.be.a('string');
    expect(newCount).to.equal(oldCount + 1);

    // Restore
    await Tittle.deleteOne({ _id: newCount });
  });

  test('should be able to retrieve a tittle with provided id', async () => {
    let providedId = 23;

    let retrievedTittle = await axios.get(`${tittleUri}/${providedId}`);
    expect(retrievedTittle.data).to.be.a('string');

    let queriedId = await Tittle.findOne({ title: retrievedTittle.data });
    expect(queriedId._id).to.equal(providedId);
  });

  test('should be able to update a tittle with provided id', async () => {
    let providedId = 37;

    let newTittle = 'test tittle';
    let oldTittle = await Tittle.findOne({ _id: providedId });
    expect(oldTittle.title).to.not.equal(newTittle);

    let updatedTittle = await axios.put(`${tittleUri}/${providedId}`, { tittle: newTittle });
    expect(updatedTittle.data).to.have.string(newTittle);

    // Restore
    await Tittle.updateOne({ _id: providedId }, { data: oldTittle.title });
  });

  test('should be able to delete a tittle with provided id', async () => {
    let providedId = 99;

    let tittleToDelete = await Tittle.findOne({ _id: providedId });
    expect(tittleToDelete.title).to.be.a('string');

    await axios.delete(`${tittleUri}/${providedId}`);
    let deletedTittle = await Tittle.findOne({ _id: providedId });
    expect(deletedTittle).to.equal(null);

    // Restore
    await Tittle.create({ _id: providedId, title: tittleToDelete.title});
  });
});


describe('CRUD for enrollments', () => {
  test('should be able to insert new enrollment it into db', async () => {
    let oldCount = await Enrolled.count();

    let newEnrollment = await axios.post(enrolledUri);
    let newCount = await Enrolled.count();

    expect(newEnrollment.data).to.be.a('number');
    expect(newCount).to.equal(oldCount + 1);

    // Restore
    await Enrolled.deleteOne({ _id: newCount });
  });

  test('should be able to retrieve a enrollment with provided id', async () => {
    let providedId = 23;

    let retrievedEnrollment = await axios.get(`${enrolledUri}/${providedId}`);
    expect(retrievedEnrollment.data).to.be.a('number');

    let queriedId = await Enrolled.findOne({ enrolled: retrievedEnrollment.data });
    expect(queriedId._id).to.equal(providedId);
  });

  test('should be able to update a enrollment with provided id', async () => {
    let providedId = 37;

    let newEnrollment = 99999;
    let oldEnrollment = await Enrolled.findOne({ _id: providedId });
    expect(oldEnrollment.enrolled).to.not.equal(newEnrollment);

    let updatedEnrollment = await axios.put(`${enrolledUri}/${providedId}`, { enrolled: newEnrollment });
    expect(updatedEnrollment.data).to.have.string(newEnrollment);

    // Restore
    await Enrolled.updateOne({ _id: providedId }, { data: oldEnrollment.enrolled });
  });

  test('should be able to delete a enrollment with provided id', async () => {
    let providedId = 99;

    let enrollmentToDelete = await Enrolled.findOne({ _id: providedId });
    expect(enrollmentToDelete.enrolled).to.be.a('number');

    await axios.delete(`${enrolledUri}/${providedId}`);
    let deletedEnrollment = await Enrolled.findOne({ _id: providedId });
    expect(deletedEnrollment).to.equal(null);

    // Restore
    await Enrolled.create({ _id: providedId, enrolled: enrollmentToDelete.enrolled});
  });
});