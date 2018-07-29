const express = require('express');
const cors = require('cors');
const {CLIENT_ORIGIN} = require('./config');

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
  
})

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

module.exports = {app};