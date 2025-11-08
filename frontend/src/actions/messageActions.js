// File: frontend/src/actions/messageActions.js

import { FETCH_MESSAGES, ADD_MESSAGE, FETCH_MEDIA_FOR_MESSAGES  } from './types';

const USER_API = process.env.REACT_APP_USER_API;
const MEDIA_API = process.env.REACT_APP_USER_MEDIA;

export const fetchMessages = () => {
  return async dispatch => {
    try {
      const response = await fetch(`${USER_API}/api/users/messages/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      dispatch({ type: FETCH_MESSAGES, payload: data });
    } catch (error) {
      console.error('Erreur lors de la récupération des messages', error);
    }
  };
};
export const fetchMediaForMessages = (messageIds) => async (dispatch) => {
  try {
    const mediaData = {};
    for (const messageId of messageIds) {
      const response = await fetch(`${MEDIA_API}/media/api/media/message/${messageId}`);
      const data = await response.json();
      mediaData[messageId] = data;
    }
    dispatch({ type: 'FETCH_MEDIA_SUCCESS', payload: mediaData });
  } catch (error) {
    console.error("❌ Erreur lors du chargement des médias:", error);
    dispatch({ type: 'FETCH_MEDIA_ERROR', error });
  }
};


export const addMessage = (formData) => {
  return async dispatch => {
    try {
      // Envoyer le titre et le contenu au backend "user--backend"
      const messageData = {
        tittle: formData.get('tittle'),
        content: formData.get('content'),
      };

      await fetch(`${USER_API}/api/users/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData),
      });

      // Uploader les fichiers image et vidéo au backend "MEDIA-BACKEND"
      const mediaFormData = new FormData();
      if (formData.get('image')) {
        mediaFormData.append('image', formData.get('image'));
      }
      if (formData.get('video')) {
        mediaFormData.append('video', formData.get('video'));
      }

      if (formData.get('image') && formData.get('video')) {
        await fetch(`${USER_API}/media/api/upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: mediaFormData,
        });
      }

      // Après l'ajout d'un nouveau message, mettre à jour la liste des messages
      dispatch(fetchMessages());
    } catch (error) {
      console.error('Erreur lors de l\'ajout du message', error);
    }
  };
  
};