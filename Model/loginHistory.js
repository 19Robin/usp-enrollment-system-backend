// // Filepath: models/LoginHistory.js
// module.exports = (sequelize, DataTypes) => {
//   const loginHistory = sequelize.define('LoginHistory', {
//     login_id: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true,
//     },
//     student_id: {
//       type: DataTypes.STRING, // Assuming student_id is a string, like 'S123456'
//       allowNull: false,
//     },
//     login_time: {
//       type: DataTypes.DATE,
//       defaultValue: DataTypes.NOW,
//     },
//     logout_time: {
//       type: DataTypes.DATE,
//       allowNull: true,
//     },
//     ip_address: {
//       type: DataTypes.STRING,
//       allowNull: true,
//     },
//     device_info: {
//       type: DataTypes.STRING,
//       allowNull: true,
//     },
//   });

//   loginHistory.associate = (models) => {
//     // Assuming there is a Student model with a student_id
//     loginHistory.belongsTo(models.UserModel, { foreignKey: 'student_id' });
//   };

//   return loginHistory;
// };

const { enrolSystemDb } = require('../db');  // Use the correct import for your MySQL connection

// Function to create a login history entry
const createLoginHistory = (studentId, ipAddress, deviceInfo, callback) => {
  if (!studentId) {
    return callback(new Error("Student ID cannot be null or undefined"), null);
  }
  const query = `
    INSERT INTO login_history (student_id, login_time, ip_address, device_info)
    VALUES (?, NOW(), ?, ?)
  `;
  
  enrolSystemDb.query(query, [studentId, ipAddress, deviceInfo], (err, results) => {
    if (err) {
      console.error("Error creating login history:", err);
      return callback(err, null);
    }
    callback(null, results);  // Return the result of the insertion
  });
};

// Function to update logout time for a login history entry
const updateLogoutTime = (loginId, callback) => {
  const query = `
    UPDATE login_history 
    SET logout_time = NOW() 
    WHERE login_id = ?
  `;
  
  enrolSystemDb.query(query, [loginId], (err, results) => {
    if (err) {
      console.error("Error updating logout time:", err);
      return callback(err, null);
    }
    callback(null, results);  // Return the result of the update
  });
};

module.exports = {
  createLoginHistory,
  updateLogoutTime,
};
