// File : media-backend/server.js

const express = require('express');
const cors = require('cors');
const path = require('path');
const { Sequelize } = require('sequelize');
const app = express();

const sequelize = require('./database');

// Middleware pour parser les fichiers multipart/form-data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 🔐 CORS pour domaine public uniquement
const isDev = process.env.NODE_ENV !== 'production';
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];

app.use(cors({
  origin: function (origin, callback) {
    if (isDev || !origin || allowedOrigins.includes(origin)) {
      callback(null, origin);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.options('*', cors());

// 🔓 Servir les fichiers statiques uploadés
app.use('/api/uploads/images', express.static(path.join(__dirname, 'uploads/images')));
app.use('/api/uploads/videos', express.static(path.join(__dirname, 'uploads/videos')));
app.use('/imagesprofile', express.static(path.join(__dirname, 'uploads/imagesprofile')));

// 🔹 Sert les images par défaut
app.use('/mediaprofile', express.static(path.join(__dirname, 'public/mediaprofile')));
// 🔹 Sert les images uploadées
app.use('/imagesprofile', express.static(path.join(__dirname, 'uploads/imagesprofile')));
// Routes API
const apiRouter = require('./apiRouter').router;
app.use('/api/', apiRouter);

// Synchroniser la base de données et démarrer le serveur
console.log('⏳ Tentative de connexion à la base de données...');
sequelize.sync({ force: false })
  .then(() => {
    app.listen(3001, () => {
      console.log('✅ Serveur MEDIA_BACKEND démarré sur le port 3001');
    });
  })
  .catch(err => {
    console.error('❌ Erreur de connexion de MEDIA_BACKEND à la base de données:', err.message);
  });
