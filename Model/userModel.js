const { enrolSystemDb } = require('../db');

const getStudentById = (studentId, callback) => {
  const query = 'SELECT * FROM students WHERE student_id = ?';
  enrolSystemDb.query(query, [studentId], (err, results) => {
    if (err) {
      return callback(err, null);
    }
    if (results.length > 0) {
      return callback(null, results[0]);
    } else {
      return callback(null, null);
    }
  });
};

const getManagerById = (managerId, callback) => {
  const query = 'SELECT * FROM managers WHERE manager_id = ?';
  enrolSystemDb.query(query, [managerId], (err, results) => {
    if (err) {
      return callback(err, null);
    }
    if (results.length > 0) {
      return callback(null, results[0]);
    } else {
      return callback(null, null);
    }
  });
};

getManagerProfilebyId = (managerId, callback) => {
  const query = `
    SELECT manager_id, first_name, last_name, email, phone
    FROM managers
    WHERE manager_id = ?
  `;
  enrolSystemDb.query(query, [managerId], (err, results) => {
    if (err) {
      return callback(err, null);
    }
    if (results.length > 0) {
      return callback(null, results[0]);
    } else {
      return callback(null, null);
    }
  });
};

const getRoleById = (roleId, callback) => {
  const query = 'SELECT * FROM roles WHERE role_id = ?';
  enrolSystemDb.query(query, [roleId], (err, results) => {
    if (err) {
      return callback(err, null);
    }
    if (results.length > 0) {
      return callback(null, results[0]);
    } else {
      return callback(null, null);
    }
  });
};

const updateStripeId = (studentId, stripeId, callback) => {
  const query = 'UPDATE students SET stripe_id = ? WHERE student_id = ?';
  enrolSystemDb.query(query, [stripeId, studentId], (err, results) => {
    if (err) {
      return callback(err, null);
    }
    if (results.affectedRows > 0) {
      return callback(null, results);
    } else {
      return callback(null, false);
    }
  });
};


module.exports = {
  getStudentById,
  getManagerById,
  getManagerProfilebyId,
  getRoleById,
  updateStripeId
};