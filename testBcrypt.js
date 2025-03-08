// filepath: c:\Users\slade\Downloads\CS415\Assignment 1\usp-enrollment-system-backend\hashMultiplePasswords.js
const bcrypt = require('bcrypt');
const saltRounds = 10;

const users = [
  { studentId: 'S11199962', password: 'password1' },
  { studentId: 'S11199963', password: 'password2' },
  { studentId: 'S11199964', password: 'password3' },
  { studentId: 'S11199965', password: 'password4' },
];

console.log('Hashing passwords...');

users.forEach(user => {
  bcrypt.hash(user.password, saltRounds, (err, hash) => {
    if (err) {
      console.error(`Error hashing password for ${user.studentId}:`, err);
    } else {
      console.log(`INSERT INTO students (student_id, password) VALUES ('${user.studentId}', '${hash}');`);
    }
  });
});

console.log('Script finished.');