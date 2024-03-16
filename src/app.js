const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });
const cookieParser = require('cookie-parser');
const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());
module.exports = app;
