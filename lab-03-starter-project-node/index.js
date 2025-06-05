require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

app.get('/', async (req, res) => {
  const [users] = await pool.query('SELECT * FROM users');
  res.render('index', { users });
});

app.get('/add', (req, res) => {
  res.render('form');
});

app.post('/add', async (req, res) => {
  const { name, email } = req.body;
  await pool.query('INSERT INTO users (name, email) VALUES (?, ?)', [name, email]);
  res.redirect('/');
});

app.post('/delete/:id', async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM users WHERE id = ?', [id]);
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`App running on http://localhost:${port}`);
});
