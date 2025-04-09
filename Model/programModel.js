const { enrolSystemDb } = require('../db');

const getPrograms = (callback, next) => {
  const query = 'SELECT * FROM programs';
  enrolSystemDb.query(query, (err, results) => {
    if (err) {
      return next(err); // Pass the error to the error middleware
    }
    return callback(null, results);
  });
};

module.exports = {
  getPrograms,
};