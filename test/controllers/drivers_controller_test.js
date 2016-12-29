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

  it('should find drivers in a location on GET /api/drivers', done => {
    const seattleDriver = new Driver({
      email: 'seattle@test.com',
      geometry: { type: 'Point', coordinates: [-122.4759902, 47.6147628] }
    });
    const miamiDriver = new Driver({
      email: 'miami@test.com',
      geometry: { type: 'Point', coordinates: [-80.253, 25.791] }
    });
    Promise.all([seattleDriver.save(), miamiDriver.save()])
      .then(() => {
        request(app)
          .get('/api/drivers?lng=-80&lat=25')
          .end((err, response) => {
            assert(response.body.length === 1);
            assert(response.body[0].obj.email === 'miami@test.com');
            done();
          });
      });
  });

});
