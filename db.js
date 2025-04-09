const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');

// Load SSL certificate
const sslOptions = {
  ca: fs.readFileSync(path.join(__dirname, 'isrgrootx1.pem')), // Ensure the certificate file is in the same directory
};

// Enrol System Database Connection
const enrolSystemDb = mysql.createPool({
  host: process.env.DB_HOST || 'gateway01.ap-northeast-1.prod.aws.tidbcloud.com',
  port: process.env.DB_PORT || 4000,
  user: process.env.DB_USER || '3w9dbUCq2F.root',
  password: process.env.DB_PASSWORD || 'kVlsmGJIgPWEw9MH',
  database: process.env.DB_NAME_ENROL || 'usp_enrol_system',
  ssl: sslOptions,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 20000, // Increase timeout to 20 seconds
});

// Grades Database Connection
const gradesDb = mysql.createPool({
  host: process.env.DB_HOST || 'gateway01.ap-northeast-1.prod.aws.tidbcloud.com',
  port: process.env.DB_PORT || 4000,
  user: process.env.DB_USER || '3w9dbUCq2F.root',
  password: process.env.DB_PASSWORD || 'kVlsmGJIgPWEw9MH',
  database: process.env.DB_NAME_GRADES || 'usp_grades',
  ssl: sslOptions,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 20000, // Increase timeout to 20 seconds
});

// Finance Database Connection
const financeDb = mysql.createPool({
  host: process.env.DB_HOST || 'gateway01.ap-northeast-1.prod.aws.tidbcloud.com',
  port: process.env.DB_PORT || 4000,
  user: process.env.DB_USER || '3w9dbUCq2F.root',
  password: process.env.DB_PASSWORD || 'kVlsmGJIgPWEw9MH',
  database: process.env.DB_NAME_FINANCE || 'usp_finance',
  ssl: sslOptions,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 20000, // Increase timeout to 20 seconds
});

// Test Connections
enrolSystemDb.getConnection((err, connection) => {
  if (err) {
    console.error('Enrol System Database connection failed: ' + err.message);
  } else {
    console.log('Connected to Enrol System MySQL Database');
    connection.release();
  }
});

gradesDb.getConnection((err, connection) => {
  if (err) {
    console.error('Grades Database connection failed: ' + err.message);
  } else {
    console.log('Connected to Grades MySQL Database');
    connection.release();
  }
});

financeDb.getConnection((err, connection) => {
  if (err) {
    console.error('Finance Database connection failed: ' + err.message);
  } else {
    console.log('Connected to Finance MySQL Database');
    connection.release();
  }
});

module.exports = { enrolSystemDb, gradesDb, financeDb };