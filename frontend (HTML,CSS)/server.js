const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',        // your MySQL username
  password: '',        // your MySQL password
  database: 'rapidcare'
});

db.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

// Register/login endpoint
app.post('/api/login', (req, res) => {
  const { name, phone } = req.body;
  if (!name || !phone) {
    return res.status(400).json({ success: false, message: 'Name and phone required' });
  }
  // Check if user exists
  db.query('SELECT * FROM users WHERE phone = ?', [phone], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'DB error' });
    if (results.length > 0) {
      // User exists, login
      return res.json({ success: true, user: results[0] });
    } else {
      // Register new user
      db.query('INSERT INTO users (name, phone) VALUES (?, ?)', [name, phone], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: 'DB error' });
        return res.json({ success: true, user: { id: result.insertId, name, phone } });
      });
    }
  });
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});