const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = require('chai').expect;
const should = chai.should();

const mongoose = require('mongoose');

const {Food} = require('../models');
const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');

chai.use(chaiHttp);

describe('API', function() {

  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  it('should 200 on GET requests', function() {
    return chai.request(app)
      .get('/')
      .then(function(res) {
        res.should.have.status(200);
        res.should.be.json;
      });
  });

  it('should return the collection on request to /api/foods', function() {
    return chai.request(app)
      .get('/api/foods')
      .then(function(res) {
        res.should.have.status(200);
        res.should.be.json;
      });
  });

});