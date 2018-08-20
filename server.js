'use strict';
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');
const passport = require('passport');

const { router: usersRouter } = require('./users');
const { router: authRouter, localStrategy, jwtStrategy } = require('./auth');

mongoose.Promise = global.Promise;

const { CLIENT_ORIGIN, DATABASE_URL, PORT } = require('./config');
const { Food } = require('./models');

const app = express();

app.use(morgan('common'));
app.use(express.json());
app.use(express.static('public'));

app.use(
  cors({
      origin: CLIENT_ORIGIN
  })
);

passport.use(localStrategy);
passport.use(jwtStrategy);

app.use('/api/users/', usersRouter);
app.use('/api/auth/', authRouter);

const jwtAuth = passport.authenticate('jwt', { session: false });

app.get('/api/auth/login ', jwtAuth, (req, res) => {
  return res.json({
    data: 'himitsu'
  });
});

//get by username
app.get('/api/my-meals/:user', (req, res) => {
  Food
    .find({"user": req.params.user})
    .then(foods => {
      res.status(200).json({
        mealsEaten: foods.map(
          (food) => food.serialize()
        )
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Error thrown during GET' });
    });
})

//main app endpoints
app.get('/api/my-meals', (req, res) => {
  Food
    .find()
    .then(foods => {
      res.status(200).json({
        mealsEaten: foods.map(
          (food) => food.serialize()
        )
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Error thrown during GET' });
    });
});

app.post('/api/my-meals', (req, res) => {
  const requiredKeys = ['name', 'category', 'nutrients', 'user'];
  for (let i = 0; i < requiredKeys.length; i++) {
    const key = requiredKeys[i];
    if (!(key in req.body)) {
      const message = `Missing \`${key}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }

  Food.create({
    name: req.body.name,
    category: req.body.category,
    nutrients: req.body.nutrients,
    user: req.body.user
  })
  .then(meal => res.status(201).json(meal.serialize()))
  .catch(err => {
    console.log(err);
    res.status(500).json({ error: 'POST not functioning correctly' });
  });
});

app.put('/api/my-meals/:id', (req, res) => {
  if(!(req.body.id)) {
    res.status(400).json({
      error: 'Request body does not contain id'
    });
  }

  if (!(req.params.id && req.params.id === req.body.id)) {
    res.status(400).json({
      error: 'Request path id and request body id values must match'
    });
  }

  const updated = {};
  const updateableKeys = ["nutrients"];

  updateableKeys.forEach(key => {
    if (key in req.body) {
      updated[key] = req.body[key];
    }
  });

  Food
    .findByIdAndUpdate(req.params.id, { $set: updated }, { new: true })
    .then(updatedMeal => {
      res.status(204).json(updatedMeal.serialize())
      console.log(updatedMeal.serialize());
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'PUT not functioning correctly' });
    });
});

app.delete('/api/my-meals/:id', (req, res) => {
  Food
    .findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).json({ message: `${req.params.id} removed` });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'DELETE misfiring '});
    });
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