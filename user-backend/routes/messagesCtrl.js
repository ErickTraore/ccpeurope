// File : user-backend/routes/messagesCtrl.js

const fetch = (...args) => import('node-fetch').then(({
    default: fetch
}) => fetch(...args));
const MEDIA_BACKEND_URL = 'http://localhost:3001/api/getMedia'; // ✅ URL de `media-backend`

const models = require('../models');
const asyncLib = require('async');
const jwtUtils = require('../utils/jwt.utils');

const TITTLE_LIMIT = 2;
const CONTENT_LIMIT = 4;

// Routes
console.log('Voici la page messagesCtrl.js');

module.exports = {
    createMessage: function (req, res) {
        console.log('Received request body:', req.body);
        console.log('Received headers:', req.headers);

        const headerAuth = req.headers['authorization'];
        const userId = jwtUtils.getUserId(headerAuth);
        console.log('Extracted userId:', userId);

        const {
            content,
            tittle,
            image,
            video
        } = req.body;

        console.log('Extracted content:', content);
        console.log('Extracted tittle:', tittle);
        console.log('Extracted image:', image);
        console.log('Extracted video:', video);
        console.log('Extracted content.length:', content.length);
        console.log('Extracted tittle.length:', tittle.length);

        if (tittle === '' || content === '') {
            console.log('Error: missing parameters');
            return res.status(400).json({
                'error': 'missing parameters'
            });
        }

        if (tittle.length <= TITTLE_LIMIT || content.length <= CONTENT_LIMIT) {
            console.log('Error: parameters do not meet length requirements');
            return res.status(400).json({
                'error': 'missing parameters LIMIT'
            });
        }

        asyncLib.waterfall([
            function (done) {
                console.log('Looking for user with id:', userId);
                models.User.findOne({
                        attributes: ['id'],
                        where: {
                            id: userId
                        }
                    })
                    .then(function (userFound) {
                        console.log('User found:', userFound);
                        done(null, userFound);
                    })
                    .catch(function (err) {
                        console.log('Error finding user:', err);
                        return res.status(500).json({
                            'error': 'unable to verify user'
                        });
                    });
            },
            function (userFound, done) {
                if (userFound) {
                    models.Message.create({
                            tittle: tittle,
                            content: content,
                            userId: userFound.id,
                            likes: 0,
                            image: image || null,
                            video: video || null
                        })
                        .then(function (newMessage) {
                            done(null, newMessage);
                        })
                        .catch(function (err) {
                            console.log('Error creating message:', err);
                            done(err);
                        });
                } else {
                    res.status(404).json({
                        'error': 'user not found'
                    });
                }
            },
        ], function (err, newMessage) {
            if (err) {
                console.log('Error in waterfall:', err);
                return res.status(500).json({
                    'error': 'cannot post message'
                });
            }
            if (newMessage) {
                // Renvoie l'ID du nouveau message
                return res.status(201).json({
                    id: newMessage.id
                });
            } else {
                return res.status(500).json({
                    'error': 'cannot post message'
                });
            }
        });
    },

    listMessages: async function (req, res) {
        try {
            const fields = req.query.fields || '*';
            const limit = parseInt(req.query.limit);
            const offset = parseInt(req.query.offset);
            const order = req.query.order || 'tittle:ASC';

            console.log('Fields:', fields);
            console.log('Limit:', isNaN(limit) ? 'default (20)' : limit);
            console.log('Offset:', isNaN(offset) ? 'default (0)' : offset);
            console.log('Order:', order);

            const messages = await models.Message.findAll({
                order: [order.split(':')], // ex: ['tittle', 'ASC']
                attributes: (fields !== '*' && fields != null) ? fields.split(',') : undefined,
                limit: (!isNaN(limit)) ? limit : 20,
                offset: (!isNaN(offset)) ? offset : 0,
                include: [{
                    model: models.User,
                    attributes: ['email']
                }]
            });


            if (!messages || messages.length === 0) {
                return res.status(200).json([]); // ✅ Réponse valide, juste vide
            }

            // ✅ Récupérer les médias pour chaque message via `getMedia`
            const enrichedMessages = await Promise.all(
                messages.map(async (message) => {
                    try {
                        const response = await fetch(`${MEDIA_BACKEND_URL}/${message.id}`);
                        const mediaData = await response.json();

                        return {
                            ...message.get({
                                plain: true
                            }), // ✅ Convertir Sequelize object en JSON
                            media: mediaData || [] // ✅ Ajouter les médias au message
                        };
                    } catch (error) {
                        console.error(`❌ Erreur lors de la récupération des médias pour le message ${message.id}:`, error);
                        return {
                            ...message.get({
                                plain: true
                            }),
                            media: []
                        }; // ✅ Si erreur, renvoyer un message sans média
                    }
                })
            );

            res.status(200).json(enrichedMessages);
        } catch (err) {
            console.log('❌ Erreur dans listMessages:', err);
            res.status(500).json({
                error: "Server error"
            });
        }
    }
};