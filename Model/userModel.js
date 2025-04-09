const { enrolSystemDb } = require('../db');

const getStudentById = (studentId, callback, next) => {
  const query = 'SELECT * FROM students WHERE student_id = ?';
  enrolSystemDb.query(query, [studentId], (err, results) => {
    if (err) {
      return next(err); // Pass the error to the error middleware
    }
    if (results.length > 0) {
      return callback(null, results[0]);
    } else {
      return callback(null, null);
    }
  });
};

const getManagerById = (managerId, callback, next) => {
  const query = 'SELECT * FROM managers WHERE manager_id = ?';
  enrolSystemDb.query(query, [managerId], (err, results) => {
    if (err) {
      return next(err); // Pass the error to the error middleware
    }
    if (results.length > 0) {
      return callback(null, results[0]);
    } else {
      return callback(null, null);
    }
  });
};

getManagerProfilebyId = (managerId, callback,next) => {
  const query = `
    SELECT manager_id, first_name, last_name, email, phone
    FROM managers
    WHERE manager_id = ?
  `;
  enrolSystemDb.query(query, [managerId], (err, results) => {
    if (err) {
      return next(err); // Pass the error to the error middleware
    }
    if (results.length > 0) {
      return callback(null, results[0]);
    } else {
      return callback(null, null);
    }
  });
};

const getRoleById = (roleId, callback, next) => {
  const query = 'SELECT * FROM roles WHERE role_id = ?';
  enrolSystemDb.query(query, [roleId], (err, results) => {
    if (err) {
      return next(err); // Pass the error to the error middleware
    }
    if (results.length > 0) {
      return callback(null, results[0]);
    } else {
      return callback(null, null);
    }
  });
};


module.exports = {
  getStudentById,
  getManagerById,
  getManagerProfilebyId,
  getRoleById
};