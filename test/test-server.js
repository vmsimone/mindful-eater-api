const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');

const expect = require('chai').expect;
const should = chai.should();

const mongoose = require('mongoose');

const {Food} = require('../models');
const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');

chai.use(chaiHttp);

function randomSelect(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function generateName() {
  const testName = ["apple", "banana", "broccoli", "pasta", "olive oil", "avocado"];
  return randomSelect(testName);
}

function generateCategory() {
  const testCategory = ["bread", "sweets", "vegetables", "fruits", "dairy", "eggs"];
  return randomSelect(testCategory);
}

function generateNutrients() {
  const testNutrients = [
    {
      "calories": 118,
      "carbs": 26.95,
      "fat": 0.39,
      "iron": 0.31,
      "protein": 1.29,
      "sugars": 14.43
    },
    {
      "calories": 1000,
      "carbs": 54.12,
      "fat": 0.33,
      "iron": 0.22,
      "protein": 1.12,
      "sugars": 12.32
    },
    {
      "calories": 244,
      "carbs": 12.95,
      "fat": 1.39,
      "iron": 0.32,
      "protein": 1.14,
      "sugars": 1.43
    },
    {
      "calories": 0,
      "carbs": 0,
      "fat": 0,
      "iron": 0,
      "protein": 0,
      "sugars": 0
    }
  ];
  return randomSelect(testNutrients);
}

function generateTestData() {
  return {
    "name": generateName(),
    "category": generateCategory(),
    "nutrients": generateNutrients(),
    "user": "Testerson"
  }
}

function clearDatabase() {
  console.warn('Clearing database');
  return mongoose.connection.dropDatabase();
}

function loadTestData() {
  console.info('now loading test data');
  const testData = [];

  for (let i=0; i<=5; i++) {
    testData.push(generateTestData());
  }
  return Food.insertMany(testData);
}

describe('Food API', function() {

  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function() {
    return loadTestData();
  });

  afterEach(function() {
    return clearDatabase();
  });

  after(function() {
    return closeServer();
  });

  describe('test server', function() {
    it('should have a 200 status', function() {
      return chai.request(app)
        .get('/')
        .then(function(res) {
          expect(res).to.have.status(200);
        });
    });
  });
  
  describe('GET endpoint', function() {
    it('should return a JSON object on request to /api/my-meals', function() {
      return chai.request(app)
        .get('/api/my-meals')
        .then(function(res) {
          res.should.have.status(200);
          res.should.be.json;
        });
    });

    it('should return all items in the database', function() {
      let res;
      return chai.request(app)
        .get('/api/my-meals')
        .then(function(_res){
          res = _res;
          expect(res.body.foodsEaten).to.have.lengthOf.at.least(1);
          return Food.count();
        })
        .then(function(count){
          expect(res.body.foodsEaten).to.have.lengthOf(count);
        });
    });

    it('should make sure they all have the correct keys', function() {
      return chai.request(app)
        .get('/api/my-meals')
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body.foodsEaten).to.be.a('array');

          res.body.foodsEaten.forEach(function(meal) {
            expect(meal).to.be.a('object');
            expect(meal).to.include.keys(
              'name', 'category', 'nutrients', 'user'
            );
        });
      });
    });

    it('should have all nutrients in each meal', function() {
      return chai.request(app)
        .get('/api/my-meals')
        .then(function(res) {
          res.body.foodsEaten.forEach(function(meal) {
            expect(meal.nutrients).to.be.a('object');
            expect(meal.nutrients).to.include.keys(
              'calories', 'carbs', 'fat', 'iron', 'protein', 'sugars'
            );
          });
        });
    });

  });
});