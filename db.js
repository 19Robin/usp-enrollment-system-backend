const mysql = require('mysql2');

const enrolSystemDb = mysql.createConnection({
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
<<<<<<< HEAD
  password: process.env.DB_PASSWORD || '8888',
  database: process.env.DB_NAME_STUDENT || 'usp_enrol', // env file
});

const financeDb =mysql.createConnection({
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '8888',
  database: process.env.DB_NAME_FINANCE || 'usp_finance', //env file

=======
  password: process.env.DB_PASSWORD || 'Bishops_2025',
  database: process.env.DB_NAME_ENROL || 'usp_enrol_system',
>>>>>>> origin/main
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
<<<<<<< HEAD
    console.error('Student Database connection failed: ' + err.message);
  } else {
    console.log('Connected to MySQL Student Database');
  }
});

=======
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

>>>>>>> origin/main
financeDb.connect((err) => {
  if (err) {
    console.error('Finance Database connection failed: ' + err.message);
  } else {
<<<<<<< HEAD
    console.log('Connected to MySQL Finance Database');
  }
});

module.exports = {db, financeDb};
=======
    console.log('Connected to Finance MySQL Database');
  }
});

module.exports = {
  enrolSystemDb,
  gradesDb,
  financeDb,
};
>>>>>>> origin/main
