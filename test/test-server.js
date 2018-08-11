const chai = require('chai');
const chaiHttp = require('chai-http');

const {app} = require('../server');

const should = chai.should();
chai.use(chaiHttp);

describe('API', function() {

  it('should 200 on GET requests', function() {
    return chai.request(app)
      .get('/')
      .then(function(res) {
        res.should.have.status(200);
        res.should.be.json;
      });
  });

  // it('should return the collection on request to /api/foods', function() {
  //   return chai.request(app)
  //     .get('/api/foods')
  //     .then(function(res) {
  //       res.should.have.status(200);
  //       res.should.be.json;
  //     });
  // });

});