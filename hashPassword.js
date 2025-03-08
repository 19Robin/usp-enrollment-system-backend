const bcrypt = require('bcrypt');
const saltRounds = 10;
const plainPassword = 'testpassword'; // Replace with your desired password

console.log('Starting script...');

console.log('Hashing password...');
bcrypt.hash(plainPassword, saltRounds, (err, hash) => {
  if (err) {
    console.error('Error hashing password:', err);
  } else {
    console.log('Hashed password:', hash);
  }
});

console.log('Script finished.');