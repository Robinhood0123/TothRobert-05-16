const express = require('express');
const cors = require('cors');
const nodemon = require('nodemon');
const axios = require('axios');
const fs = require('fs');
const app = express();


app.use(cors());
app.use(express.json());

const USERS_FILE = './users.json';
const RESET_FILE = './reset_users.json';

function readUsers() {
  return JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
}

function writeUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

app.get('/', (req, res) => {
  res.json(readUsers());
});

app.get('/users/:id', (req, res) => {
  const id = Number(req.params.id);
  const user = readUsers().find(u => u.id === id);
  user ? res.json(user) : res.status(404).json({ error: 'Nincs ilyen felhasználó' });
});

app.post('/ujuser', (req, res) => {
  const newUser = req.body;
  if (!newUser.id) return res.status(400).json({ error: 'Kell ID!' });

  const users = readUsers();
  if (users.find(u => u.id === newUser.id)) {
    return res.status(400).json({ error: 'Már van ilyen ID!' });
  }

  users.push(newUser);
  writeUsers(users);
  res.status(201).json(newUser);
});

app.delete('/delete/:id', (req, res) => {
  const id = Number(req.params.id);
  const users = readUsers();
  const updated = users.filter(u => u.id !== id);
  if (users.length === updated.length) return res.status(404).json({ error: 'Nincs ilyen ID!' });

  writeUsers(updated);
  res.json({ message: 'Törölve.' });
});

app.post('/reset', (req, res) => {
  fs.copyFileSync(RESET_FILE, USERS_FILE);
  res.json({ message: 'Visszaállítva reset_users.json alapján.' });
});

app.listen(3000, () => {
  console.log('Fut: http://localhost:3000');
});