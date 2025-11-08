// File : user-backend/models/index.js


const path = require('path');
const Sequelize = require('sequelize');
require('dotenv').config();

const env = process.env.NODE_ENV || 'development';
const configPath = path.join(__dirname, '..', 'config', 'config.js');
const config = require(configPath)[env];

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect,
  logging: false,
});

const User = require('./user')(sequelize, Sequelize.DataTypes);
const Message = require('./message')(sequelize, Sequelize.DataTypes);
const Profile = require('./profile')(sequelize, Sequelize.DataTypes);

// Définir les associations
User.associate({ Message, Profile });
Message.associate({ User });
Profile.associate({ User });

sequelize.sync({ alter: true })
  .then(() => console.log('Connexion USERS-BACKEND à sa BDD réussie sur le port 5000'))
  .catch(err => console.error('Erreur de synchronisation USER-BACKEND', err));

module.exports = {
  sequelize,
  User,
  Message,
  Profile,
};
