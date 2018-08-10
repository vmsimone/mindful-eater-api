'use strict';

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const { CLIENT_ORIGIN, DATABASE_URL, PORT } = require('./config');
const { Food } = require('./models');

const app = express();
app.use(
  cors({
      origin: CLIENT_ORIGIN
  })
);
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  console.log('this part is working');
  res.json({'working': 'hard'});
})

app.get('/api/foods', (req, res) => {
  // console.log('GET request made');
  // console.log(Food.find(foods[0]));
  // Food
  //   .find()
  //   .then(foods => {
  //     res.json({
  //       foods
  //     });
  //   })
  //   .catch(err => {
  //     console.error(err);
  //     res.status(500).json({ error: 'Error thrown during GET' });
  //   });
});

app.post('/:username/my-meals', (req, res) => {
  // Food
  //   .find(req.params.username)
  //   .then()
});

app.put('/:username/my-meals/:id', (req, res) =>{

});

app.delete('/:username/my-meals/:id', (req, res) => {

});

app.use('*', function (req, res) {
  res.status(404).json({ message: 'Not Found' });
});

let server;

function runServer(databaseUrl, port = PORT) {

  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Listening on port ${port}`);
        resolve();
      })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = {app, runServer, closeServer};