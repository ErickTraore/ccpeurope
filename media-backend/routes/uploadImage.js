// File : media-backend/routes/uploadImage.js


const express = require('express');
const router = express.Router();
const { upload, uploadImage } = require('../controllers/uploadImageController');

// Route pour uploader une image
router.post('/', upload.single('image'), uploadImage);

module.exports = router;
