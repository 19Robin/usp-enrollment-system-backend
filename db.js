// filepath: c:\Users\slade\Downloads\CS415\Assignment 1\usp-enrollment-system-backend\db.js
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '8888',
  database: process.env.DB_NAME_STUDENT || 'usp_enrol', // env file
});

const financeDb =mysql.createConnection({
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '8888',
  database: process.env.DB_NAME_FINANCE || 'usp_finance', //env file

});

db.connect((err) => {
  if (err) {
    console.error('Student Database connection failed: ' + err.message);
  } else {
    console.log('Connected to MySQL Student Database');
  }
});

financeDb.connect((err) => {
  if (err) {
    console.error('Finance Database connection failed: ' + err.message);
  } else {
    console.log('Connected to MySQL Finance Database');
  }
});

module.exports = {db, financeDb};