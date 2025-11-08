// File: frontend3/user-backend/models/user.js

const { Sequelize } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    email: Sequelize.STRING,
    bio: Sequelize.TEXT,
    password: Sequelize.STRING,
    isAdmin: Sequelize.BOOLEAN,
    lastActivity: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
  });

  User.associate = (models) => {
    User.hasMany(models.Message, { foreignKey: 'userId' });
  };

  return User;
};
