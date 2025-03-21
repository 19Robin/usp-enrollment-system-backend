// filepath: c:\Users\slade\Downloads\CS415\Assignment 1\usp-enrollment-system-backend\Model\programModel.js
const db = require('../db');

const getPrograms = (callback) => {
  const query = 'SELECT * FROM programs';
  db.query(query, (err, results) => {
    if (err) {
      return callback(err, null);
    }
    return callback(null, results);
  });
};

module.exports = {
  getPrograms,
};