require('dotenv').config()
const { Client } = require('pg');
const DB_NAME = 'todoapp'
const DB_URL = process.env.DATABASE_URL || `postgres://postgres@localhost:5432/${ DB_NAME }`;
// const CONNECTION_STRING = process.env.DATABASE_URL || `postgres://postgres@localhost:5432/fitness-dev`
const client = new Client(DB_URL);

module.exports = client;