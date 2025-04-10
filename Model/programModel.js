const { enrolSystemDb } = require('../db');

const getPrograms = (callback) => {
  const query = 'SELECT * FROM programs';
  enrolSystemDb.query(query, (err, results) => {
    if (err) {
      return callback(err, null);
    }
    return callback(null, results);
  });
};

module.exports = {
  getPrograms,
};