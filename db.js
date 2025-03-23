const mysql = require('mysql2');

const enrolSystemDb = mysql.createConnection({
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
<<<<<<< HEAD
  password: process.env.DB_PASSWORD || '@Kavithex16',
  database: process.env.DB_NAME || 'USPEnrollment',
=======
  password: process.env.DB_PASSWORD || 'Bishops_2025',
  database: process.env.DB_NAME_ENROL || 'usp_enrol_system',
>>>>>>> 1030656fa245f15562fbc939fe8990b042ebcbfb
});

const gradesDb = mysql.createConnection({
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Bishops_2025',
  database: process.env.DB_NAME_GRADES || 'usp_grades',
});

const financeDb = mysql.createConnection({
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Bishops_2025',
  database: process.env.DB_NAME_FINANCE || 'usp_finance',
});

enrolSystemDb.connect((err) => {
  if (err) {
    console.error('Enrol System Database connection failed: ' + err.message);
  } else {
    console.log('Connected to Enrol System MySQL Database');
  }
});

gradesDb.connect((err) => {
  if (err) {
    console.error('Grades Database connection failed: ' + err.message);
  } else {
    console.log('Connected to Grades MySQL Database');
  }
});

financeDb.connect((err) => {
  if (err) {
    console.error('Finance Database connection failed: ' + err.message);
  } else {
    console.log('Connected to Finance MySQL Database');
  }
});

module.exports = {
  enrolSystemDb,
  gradesDb,
  financeDb,
};