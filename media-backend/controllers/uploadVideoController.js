// File : media-backend/controllers/videoController.js

const multer = require('multer');
const path = require('path');
const { Media } = require('../models');


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/videos/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!['.mp4', '.mov', '.avi', '.mkv'].includes(ext)) {
      return cb(new Error('Seules les vidéos sont autorisées'));
    }
    cb(null, true);
  }
});

const uploadVideo = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Aucun fichier n'a été téléchargé." });
  }

  try {
    console.log('📥 Vidéo reçue :', req.file);
    console.log('📦 req.body:', req.body);

    const mediaFile = await Media.create({
      filename: req.file.filename,
      path: req.file.path,
      type: 'video',
      messageId: req.body.messageId || null,
    });

    res.status(201).json({
      message: 'Vidéo uploadée avec succès',
      media: mediaFile
    });
  } catch (error) {
    console.error("❌ Erreur lors de l'upload de la vidéo :", error);
    console.error('❌ Erreur Sequelize :', error.message);
    res.status(500).json({ error: "Erreur du serveur" });
  }
};

module.exports = {
  upload,
  uploadVideo
};
