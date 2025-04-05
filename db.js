const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');

<<<<<<< HEAD
// Load SSL certificate
const sslOptions = {
  ca: fs.readFileSync(path.join(__dirname, 'isrgrootx1.pem')), // Ensure the certificate file is in the same directory
};

// Enrol System Database Connection
const enrolSystemDb = mysql.createPool({
=======
// const enrolSystemDb = mysql.createConnection({
//   host: process.env.DB_HOST || '127.0.0.1',
//   port: process.env.DB_PORT || 3306,
//   user: process.env.DB_USER || 'root',
//   password: process.env.DB_PASSWORD || '8888',
//   database: process.env.DB_NAME_ENROL || 'usp_enrol',
// });
////////////////////////////////LANA DB
const enrolSystemDb = mysql.createConnection({
>>>>>>> f973dd06a942f36a80cdfe1f46161070593be665
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

<<<<<<< HEAD
// Grades Database Connection
const gradesDb = mysql.createPool({
=======
// const gradesDb = mysql.createConnection({
//   host: process.env.DB_HOST || '127.0.0.1',
//   port: process.env.DB_PORT || 3306,
//   user: process.env.DB_USER || 'root',
//   password: process.env.DB_PASSWORD || 'Prima@2025',
//   database: process.env.DB_NAME_GRADES || 'usp_grades',
// });

//////////////////////////////lana db

const gradesDb = mysql.createConnection({
>>>>>>> f973dd06a942f36a80cdfe1f46161070593be665
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

<<<<<<< HEAD
// Finance Database Connection
const financeDb = mysql.createPool({
=======
// const financeDb = mysql.createConnection({
//   host: process.env.DB_HOST || '127.0.0.1',
//   port: process.env.DB_PORT || 3306,
//   user: process.env.DB_USER || 'root',
//   password: process.env.DB_PASSWORD || '8888',
//   database: process.env.DB_NAME_FINANCE || 'usp_finance',
// });


///////////////////////////////////lana DB


const financeDb = mysql.createConnection({
>>>>>>> f973dd06a942f36a80cdfe1f46161070593be665
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
    console.error('Student Database connection failed: ' + err.message);
  } else {
<<<<<<< HEAD
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
=======
    console.log('Connected to MySQL Student Database');
>>>>>>> f973dd06a942f36a80cdfe1f46161070593be665
  }
});

financeDb.getConnection((err, connection) => {
  if (err) {
    console.error('Finance Database connection failed: ' + err.message);
  } else {
<<<<<<< HEAD
    console.log('Connected to Finance MySQL Database');
    connection.release();
  }
});

module.exports = { enrolSystemDb, gradesDb, financeDb };
=======
    console.log('Connected to MySQL Finance Database');
  }
});


gradesDb.connect((err) => {
  if (err) {
    console.error('Grades Database connection failed: ' + err.message);
  } else {
    console.log('Connected to MySQL Grades Database');
  }
});

module.exports = {enrolSystemDb, financeDb, gradesDb};
>>>>>>> f973dd06a942f36a80cdfe1f46161070593be665
