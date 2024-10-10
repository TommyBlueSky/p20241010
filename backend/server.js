// server.js
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(bodyParser.json());

// MySQL接続
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'p20241010',
  charset: 'utf8mb4', // 日本語対応の文字コード
});

db.connect(err => {
  if (err) throw err;
  console.log('MySQL Connected!');
});

// CRUD API
app.get('/api/tasks', (req, res) => {
  db.query('SELECT * FROM tasks', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

app.post('/api/tasks', async (req, res) => {
  const task = req.body;
  try {
    const result = await new Promise((resolve, reject) => {
      db.query('INSERT INTO tasks SET ?', task, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
    res.json({ id: result.insertId, ...task });
  } catch (error) {
    console.error('Error inserting task:', error);
    res.status(500).json({ error: 'Database error occurred' });
  }
});

app.put('/api/tasks/:id', (req, res) => {
  const taskId = req.params.id;
  db.query('UPDATE tasks SET completed = NOT completed WHERE id = ?', [taskId], (err) => {
    if (err) throw err;
    res.sendStatus(204);
  });
});

app.delete('/api/tasks/:id', (req, res) => {
  const taskId = req.params.id;
  db.query('DELETE FROM tasks WHERE id = ?', [taskId], (err) => {
    if (err) throw err;
    res.sendStatus(204);
  });
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
