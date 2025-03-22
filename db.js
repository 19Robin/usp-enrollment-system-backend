const mysql = require('mysql2');

const enrolSystemDb = mysql.createConnection({
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

const gradesDb = mysql.createConnection({
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Bishops_2025',
  database: process.env.DB_NAME_GRADES || 'usp_grades',
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
