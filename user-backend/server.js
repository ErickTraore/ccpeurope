// File: user-backend/server.js (PRODUCTION)

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Sequelize } = require('sequelize');
const { getSignature } = require('./routes/zoomCtrl');
const apiRouter = require('./apiRouter').router;

const server = express();
const port = process.env.PORT || 5000;

// 🔐 CORS pour domaine public uniquement
const isDev = process.env.NODE_ENV !== 'production';
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];

server.use(cors({
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
server.options('*', cors());

// 📦 Middleware
server.use(express.json({ limit: '5mb' }));
server.use(express.urlencoded({ extended: true }));

// 🧠 Connexion BDD
const sequelize = new Sequelize(
  process.env.DB_NAME_DEVELOPMENT,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    logging: false,
  }
);

sequelize.authenticate()
  .then(() => console.log('✅ USER-BACKEND connecté à la BDD (dev)'))
  .catch(err => console.error('❌ Échec BDD (dev) :', err.message));

// 🔁 Routes
server.get('/', (req, res) => res.status(200).send('USER-BACKEND (prod) actif'));
server.get('/api/zoom/signature', getSignature);
server.use('/api/', apiRouter);

// 🚀 Démarrage
server.listen(port, () => {
  console.log(`✅ USER-BACKEND (dev) lancé sur le port ${port}`);
});

