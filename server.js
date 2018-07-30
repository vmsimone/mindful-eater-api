const express = require('express');
const cors = require('cors');
const {CLIENT_ORIGIN} = require('./config');
const {Food} = require('./models');

const app = express();

const PORT = process.env.PORT || 3000;

app.use(
  cors({
      origin: CLIENT_ORIGIN
  })
);

app.get('/api/*', (req, res) => {
  res.json({ok: true});
});

app.get('/:username/my-meals', (req, res) => {
  Food
    .find()
    .then(foods => {
      res.json(foods.map(food => food.serialize()));
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({message: 'Error: GET endpoint misfired'});
    });
});

app.post('/:username/my-meals', (req, res) => {

});

app.put('/:username/my-meals/:id', (req, res) =>{

});

app.delete('/:username/my-meals/:id', (req, res) => {

});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

module.exports = {app};