// filepath: c:\Users\slade\Downloads\CS415\Assignment 1\usp-enrollment-system-backend\hashPassword.js
const bcrypt = require('bcrypt');
const saltRounds = 10;

const manager = {
  manager_id: 'H11199966',
  first_name: 'Litia',
  last_name: 'Konusi',
  dob: '1980-01-01',
  email: 'litia.konusi@gmail.com',
  phone: '1234567890',
  password: 'password5',
  role: 'manager'
};

bcrypt.hash(manager.password, saltRounds, (err, hash) => {
  if (err) {
    console.error('Error hashing password:', err);
  } else {
    console.log(`INSERT INTO managers (manager_id, first_name, last_name, email, phone, password, role) VALUES ('${manager.manager_id}', '${manager.first_name}', '${manager.last_name}', '${manager.email}', '${manager.phone}', '${hash}', '${manager.role}');`);
  }
});