//File media-backend/apiRouter.js

const express = require('express');
const uploadImageRoutes = require('./routes/uploadImage');
const uploadImageProfileRoutes = require('./routes/uploadImageProfile'); // ✅ nouvelle ligne
const uploadVideoRoutes = require('./routes/uploadVideo');
const getMediaRoutes = require('./routes/getMedia'); // ✅ Ajout de la nouvelle route
const mediaProfileController = require('./controllers/mediaProfileController');

exports.router = (function () {
    const apiRouter = express.Router();

    // Routes pour récupérer et uploader des fichiers
    apiRouter.use('/uploadImage', uploadImageRoutes);
    apiRouter.use('/uploadImageProfile', uploadImageProfileRoutes); // ✅ ajout ici
    apiRouter.use('/uploadVideo', uploadVideoRoutes);
    apiRouter.use('/getMedia', getMediaRoutes);

    // ✅ Nouvelle route pour récupérer les médias
    apiRouter.route('/mediaProfile/:profileId/').get(mediaProfileController.getMediaByProfileId);
    apiRouter.route('/mediaProfile/').post(mediaProfileController.createMediaProfile)
    apiRouter.route('/mediaProfile/:id/').put(mediaProfileController.updateMediaProfile)
    apiRouter.route('/mediaProfile/:id/').delete(mediaProfileController.deleteMediaProfile)

    module.exports = { router: apiRouter };
})();