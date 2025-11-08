// File: frontend/src/components/messages/presse/FormArticleVideo.jsx


import React, { useState, useRef } from 'react';
import { triggerFormatReset } from '../../../utils/formatController';

const USER_API = process.env.REACT_APP_USER_API;
const MEDIA_API = process.env.REACT_APP_MEDIA_API;

const FormArticleVideo = () => {
  const [newMessage, setNewMessage] = useState({
    tittle: '',
    content: '',
    video: null,
  });
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    setNewMessage({ ...newMessage, [e.target.name]: e.target.value });
    setErrorMessage('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('✅ Vidéo sélectionnée :', file);
      setNewMessage((prevState) => ({ ...prevState, video: file }));
    } else {
      console.error('❌ Aucune vidéo sélectionnée.');
    }
  };

  const uploadVideo = async (file, messageId) => {
    const formData = new FormData();
    formData.append('video', file);
    formData.append('messageId', messageId);

    try {
      const response = await fetch(`${MEDIA_API}/api/uploadVideo`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`❌ Erreur upload vidéo: ${response.status}`);
      }

      console.log('✅ Vidéo envoyée avec succès');
    } catch (error) {
      console.error('❌ Erreur lors de l\'upload de la vidéo:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newMessage.tittle || !newMessage.content || !newMessage.video) {
      setErrorMessage('⚠️ Titre, contenu et vidéo sont obligatoires.');
      return;
    }

    if (newMessage.content.length > 50000) {
      setErrorMessage('⚠️ Le contenu est trop volumineux (max 50000 caractères).');
      return;
    }

    try {
      const messageResponse = await fetch(`${USER_API}/api/users/messages/new`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tittle: newMessage.tittle,
          content: newMessage.content,
        }),
      });


      if (!messageResponse.ok) {
        throw new Error(`❌ Erreur HTTP ${messageResponse.status}`);
      }

      const { id: newMessageId } = await messageResponse.json();

      await uploadVideo(newMessage.video, newMessageId);

      setNewMessage({ tittle: '', content: '', video: null });
      if (fileInputRef.current) fileInputRef.current.value = '';
      setErrorMessage('');

      // 🔁 Réinitialisation du format dans Presse.jsx
      triggerFormatReset();
    } catch (error) {
      console.error('❌ Erreur lors de l\'envoi:', error);
      setErrorMessage('⚠️ Une erreur est survenue lors de l\'envoi.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="tittle"
        value={newMessage.tittle}
        onChange={handleInputChange}
        placeholder="Titre"
        required
      />
      <textarea
        name="content"
        value={newMessage.content}
        onChange={handleInputChange}
        placeholder="Contenu"
        required
      />

      {/* Champ natif masqué */}
      <input
        type="file"
        name="video"
        accept="video/*"
        onChange={handleFileChange}
        ref={fileInputRef}
        style={{ display: 'none' }}
      />

      {/* Bouton personnalisé */}
      <button type="button" onClick={() => fileInputRef.current?.click()}>
        🎥 Sélectionner une vidéo
      </button>

      {/* Aperçu du fichier vidéo */}
      {newMessage.video && (
        <div style={{ marginTop: '10px' }}>
          <p>🎬 Vidéo sélectionnée :</p>
          <ul>
            <li><strong>Nom :</strong> {newMessage.video.name}</li>
            <li><strong>Taille :</strong> {(newMessage.video.size / 1024 / 1024).toFixed(2)} Mo</li>
          </ul>

          <video
            controls
            width="320"
            style={{ marginTop: '10px' }}
            src={URL.createObjectURL(newMessage.video)}
          />
        </div>
      )}


      <button type="submit">📨 Publier</button>

      {errorMessage && <p style={{ color: 'red' }}><strong>{errorMessage}</strong></p>}
    </form>
  );
};

export default FormArticleVideo;
