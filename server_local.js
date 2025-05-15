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

// Segédfüggvények
function readUsers() {
  const data = fs.readFileSync(USERS_FILE, 'utf-8');
  return JSON.parse(data);
}

function writeUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// GET / – Összes felhasználó listázása
app.get('/', (req, res) => {
  try {
    const users = readUsers();
    res.json(users);
  } catch {
    res.status(500).json({ error: 'Nem sikerült beolvasni az adatokat.' });
  }
});

// GET /users/:id – Egy adott felhasználó lekérése
app.get('/users/:id', (req, res) => {
  const id = Number(req.params.id);
  const users = readUsers();
  const user = users.find(u => u.id === id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: 'Felhasználó nem található.' });
  }
});

// POST /ujuser – Új felhasználó hozzáadása
app.post('/ujuser', (req, res) => {
  const newUser = req.body;
  if (!newUser.id) {
    return res.status(400).json({ error: 'Az id mező kötelező!' });
  }
  const users = readUsers();
  if (users.find(u => u.id === newUser.id)) {
    return res.status(400).json({ error: 'Ilyen ID-jű felhasználó már létezik!' });
  }
  users.push(newUser);
  writeUsers(users);
  res.status(201).json(newUser);
});

// DELETE /delete/:id – Felhasználó törlése
app.delete('/delete/:id', (req, res) => {
  try {
    const id = Number(req.params.id);
    let users = readUsers();

    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      return res.status(404).json({ error: 'Felhasználó nem található.' });
    }

    users.splice(userIndex, 1); // törlés index alapján
    writeUsers(users);

    res.json({ message: 'Felhasználó törölve.' });
  } catch (err) {
    res.status(500).json({ error: 'Hiba történt a törlés során.' });
  }
});

app.get('/reset', (req, res) => {
  try {
    const resetData = fs.readFileSync(RESET_FILE, 'utf-8');
    fs.writeFileSync(USERS_FILE, resetData);
    res.json({ message: 'Felhasználók visszaállítva a reset_users.json alapján.' });
  } catch {
    res.status(500).json({ error: 'Nem sikerült visszaállítani az adatokat.' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Szerver fut: http://localhost:${PORT}`);
});