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

const users = () => JSON.parse(fs.readFileSync(USERS_FILE));
const save = data => fs.writeFileSync(USERS_FILE, JSON.stringify(data, null, 2));

app.get('/', (req, res) => res.json(users()));

app.get('/users/:id', (req, res) => {
  const user = users().find(u => u.id === +req.params.id);
  user ? res.json(user) : res.status(404).json({ error: 'Nincs ilyen ID' });
});

app.post('/ujuser', (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ error: 'Kell ID' });
  const data = users();
  if (data.find(u => u.id === id)) return res.status(400).json({ error: 'Foglalt ID' });

  data.push(req.body);
  save(data);
  res.status(201).json(req.body);
});

app.delete('/delete/:id', (req, res) => {
  const data = users();
  const filtered = data.filter(u => u.id !== +req.params.id);
  if (data.length === filtered.length) return res.status(404).json({ error: 'Nincs ilyen ID' });

  save(filtered);
  res.json({ message: 'Törölve' });
});

app.post('/reset', (req, res) => {
  fs.copyFileSync(RESET_FILE, USERS_FILE);
  res.json({ message: 'Visszaállítva' });
});

app.listen(3000, () => {
  console.log('A szerver a 3000-es porton fut.');
});