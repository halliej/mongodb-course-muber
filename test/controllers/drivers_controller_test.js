const assert = require('assert');
const request = require('supertest');
const mongoose = require('mongoose');

const app = require('../../app');
const Driver = mongoose.model('driver');

describe('Drivers controller', () => {
  it('should create a new driver on POST to /api/drivers', done => {
    Driver.count().then(count => {
      request(app)
        .post('/api/drivers')
        .send({ email: 'test@test.com' })
        .end(() => {
          Driver.count().then(newCount => {
            assert(count + 1 === newCount);
            done();
          });
        });
    });
  });

  it('should update a driver on PUT to /api/drivers/:id', done => {
    const driver = new Driver({ email: 't@t.com', driving: false });
    driver.save().then(() => {
      request(app)
        .put(`/api/drivers/${driver._id}`)
        .send({ driving: true })
        .end(() => {
          Driver.findOne({ email: 't@t.com' })
            .then(driver => {
              assert(driver.driving === true);
              done();
            });
        });
    });
  });

  it('should remove a driver on DELETE to /api/drivers/:id', done => {
    const driver = new Driver({ email: 't2@t2.com', driving: false });
    driver.save().then(() => {
      request(app)
        .delete(`/api/drivers/${driver._id}`)
        .end(() => {
          Driver.findOne({ email: 't2@t2.com' })
            .then(driver => {
              assert(driver === null);
              done();
            });
        });
    });
  });

});
