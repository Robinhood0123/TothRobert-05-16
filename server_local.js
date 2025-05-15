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
  const users = readUsers();
  res.json(users);
});

app.get('/users/:id', (req, res) => {
  const id = +req.params.id;
  const users = readUsers();
  const user = users.find(u => u.id === id);
  if (user) res.json(user);
  else res.status(404).json({ error: 'Felhasználó nem található.' });
});

app.post('/ujuser', (req, res) => {
  const newUser = req.body;
  if (!newUser.id) return res.status(400).json({ error: 'Az id mező kötelező!' });

  const users = readUsers();
  if (users.some(u => u.id === newUser.id)) {
    return res.status(400).json({ error: 'Ilyen ID-jű felhasználó már létezik!' });
  }
  users.push(newUser);
  writeUsers(users);
  res.status(201).json(newUser);
});

app.delete('/delete/:id', (req, res) => {
  const id = +req.params.id;
  let users = readUsers();
  if (!users.some(u => u.id === id)) {
    return res.status(404).json({ error: 'Felhasználó nem található.' });
  }
  users = users.filter(u => u.id !== id);
  writeUsers(users);
  res.json({ message: 'Felhasználó törölve.' });
});

app.post('/reset', (req, res) => {
  const resetData = fs.readFileSync(RESET_FILE, 'utf-8');
  fs.writeFileSync(USERS_FILE, resetData);
  res.json({ message: 'Felhasználók visszaállítva.' });
});

app.listen(3000, () => {
  console.log('Szerver fut a http://localhost:3000 címen');
});