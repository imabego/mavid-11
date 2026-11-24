const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/vendeur', (req, res) => {
  res.sendFile(path.join(__dirname, 'vendeur.html'));
});

app.get('/boss', (req, res) => {
  res.sendFile(path.join(__dirname, 'boss.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('MAVID en ligne sur port ' + PORT);
});
