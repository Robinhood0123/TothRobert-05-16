const express = require('express');
const cors = require('cors');
const nodemon = require('nodemon');
const axios = require('axios');
const fs = require('fs');

const app = express();
app.use(express.json());

const PORT = 3000;