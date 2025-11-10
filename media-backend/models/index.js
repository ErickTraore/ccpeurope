// File : media-backend/models/index.js

const path = require('path');
const { Sequelize } = require('sequelize');
require('dotenv').config();

const env = process.env.NODE_ENV || 'media';
const configPath = path.join(__dirname, '..', 'config', 'config.js');
const config = require(configPath)[env];

const sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect,
    logging: false,
});

// Import des modèles
const Media = require('./media')(sequelize, Sequelize.DataTypes);
const MediaProfile = require('./mediaProfile')(sequelize, Sequelize.DataTypes);

// Définir les associations
if (Media.associate) Media.associate({ MediaProfile });
if (MediaProfile.associate) MediaProfile.associate({ Media });

// Synchronisation automatique
sequelize.sync()
    .then(() => console.log('Connexion MEDIA-BACKEND à sa BDD réussie'))
    .catch(err => console.error('Erreur de synchronisation MEDIA-BACKEND', err));

// Export des modèles et de l'instance Sequelize
module.exports = {
    sequelize,
    Media,
    MediaProfile,
};