import { json } from 'body-parser';
import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import mysql from 'mysql';
import { createContext } from './init';
import { route } from './route';

dotenv.config();

const app = express();

const port = process.env.PORT;

app.use(json());

const pool = mysql.createPool({
  connectionLimit : 10,
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '',
  database: 'masterdata',
  multipleStatements: true,
});

pool.getConnection((err, conn) => {
  if (err) {
    console.error('Failed to connect to MySQL.', err.message, err.stack);
  }
  if (conn) {
    const ctx = createContext(pool);
    route(app, ctx);
    http.createServer(app).listen(port, () => {
      console.log('Start server at port ' + port);
    });
    console.log('Connected successfully to MySQL.');
  }
});
