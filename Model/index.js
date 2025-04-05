// Filepath: c:\Users\User\Desktop\CS415\usp-enrollment-system-backend\Models\index.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL); // or use the correct config for your DB

// Import models
const LoginHistory = require('./loginHistory')(sequelize, DataTypes); // Import the loginHistory model

// Export models and sequelize instance
module.exports = {
  sequelize,
  models: {
    LoginHistory,  // Export the model
  },
};
