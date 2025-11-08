// File : media-backend/controllers/getMediaController.js

const express = require('express');
const router = express.Router();
const { Media } = require('../models'); 

const getMedia = async (req, res) => {
    try {
        const { messageId } = req.params;
        const mediaFiles = await Media.findAll({ where: { messageId } });

        if (mediaFiles.length === 0) {
            return res.status(404).json({ error: "Aucun média trouvé pour ce message." });
        }

        res.status(200).json(mediaFiles);
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des médias :", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

module.exports = { getMedia }; // ✅ Assure que `getMedia` est bien exporté
