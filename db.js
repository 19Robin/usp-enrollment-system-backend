const mysql = require('mysql2');
const fs = require('fs');

// const enrolSystemDb = mysql.createConnection({
//   host: process.env.DB_HOST || '127.0.0.1',
//   port: process.env.DB_PORT || 3306,
//   user: process.env.DB_USER || 'root',
//   password: process.env.DB_PASSWORD || 'Prima@2025',
//   database: process.env.DB_NAME_ENROL || 'usp_enrol_system',
// });

const enrolSystemDb = mysql.createConnection({
  host: process.env.DB_HOST || 'gateway01.ap-northeast-1.prod.aws.tidbcloud.com',
  port: process.env.DB_PORT || 4000,
  user: process.env.DB_USER || '3w9dbUCq2Ffaa6F.root',
  password: process.env.DB_PASSWORD || 'kVlsmGJIgPWEw9MH',
  database: process.env.DB_NAME_ENROL || 'usp_enrol_system',
  ssl:{
    ca: fs.readFileSync(process.env.CA)
  }
});

// const gradesDb = mysql.createConnection({
//   host: process.env.DB_HOST || '127.0.0.1',
//   port: process.env.DB_PORT || 3306,
//   user: process.env.DB_USER || 'root',
//   password: process.env.DB_PASSWORD || 'Prima@2025',
//   database: process.env.DB_NAME_GRADES || 'usp_grades',
// });

const gradesDb = mysql.createConnection({
  host: process.env.DB_HOST || 'gateway01.ap-northeast-1.prod.aws.tidbcloud.com',
  port: process.env.DB_PORT || 4000,
  user: process.env.DB_USER || '3w9dbUCq2Ffaa6F.root',
  password: process.env.DB_PASSWORD || 'kVlsmGJIgPWEw9MH',
  database: process.env.DB_NAME_GRADES || 'usp_grades',
  ssl:{
    ca: fs.readFileSync(process.env.CA)
  }
});

// const financeDb = mysql.createConnection({
//   host: process.env.DB_HOST || '127.0.0.1',
//   port: process.env.DB_PORT || 3306,
//   user: process.env.DB_USER || 'root',
//   password: process.env.DB_PASSWORD || 'Prima@2025',
//   database: process.env.DB_NAME_FINANCE || 'usp_finance',
// });

const financeDb = mysql.createConnection({
  host: process.env.DB_HOST || 'gateway01.ap-northeast-1.prod.aws.tidbcloud.com',
  port: process.env.DB_PORT || 4000,
  user: process.env.DB_USER || '3w9dbUCq2Ffaa6F.root',
  password: process.env.DB_PASSWORD || 'kVlsmGJIgPWEw9MH',
  database: process.env.DB_NAME_FINANCE || 'usp_finance',
  ssl:{
    ca: fs.readFileSync(process.env.CA)
  }
});

enrolSystemDb.connect((err) => {
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


gradesDb.connect((err) => {
  if (err) {
    console.error('Grades Database connection failed: ' + err.message);
  } else {
    console.log('Connected to MySQL Grades Database');
  }
});

module.exports = {enrolSystemDb, financeDb,  gradesDb};
