// File: frontend/src/components/messages/presse/FormArticleThumbnailVideo.jsx


import React, { useState, useRef } from 'react';
import { triggerFormatReset } from '../../../utils/formatController';

const USER_API = process.env.REACT_APP_USER_API;
const MEDIA_API = process.env.REACT_APP_MEDIA_API;

const FormArticleThumbnailVideo = () => {
  const [newMessage, setNewMessage] = useState({
    tittle: '',
    content: '',
    image: null,
    video: null,
  });
  const [errorMessage, setErrorMessage] = useState('');
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const handleInputChange = (e) => {
    setNewMessage({ ...newMessage, [e.target.name]: e.target.value });
    setErrorMessage('');
  };

  const handleFileChange = (e) => {
    const { name } = e.target;
    const file = e.target.files[0];
    if (file) {
      setNewMessage((prevState) => ({ ...prevState, [name]: file }));
    }
  };

  const uploadFile = async (file, endpoint, messageId) => {
    const formData = new FormData();
    formData.append(endpoint, file);
    formData.append('messageId', messageId);

    try {
      const response = await fetch(`https://localhost:3001/api/upload${endpoint.charAt(0).toUpperCase() + endpoint.slice(1)}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload ${endpoint} failed: ${response.status}`);
      }
    } catch (error) {
      console.error(`Upload error (${endpoint}):`, error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newMessage.tittle || !newMessage.content || !newMessage.image || !newMessage.video) {
      setErrorMessage('⚠️ Titre, contenu, image et vidéo sont obligatoires.');
      return;
    }

    if (newMessage.content.length > 50000) {
      setErrorMessage('⚠️ Le contenu est trop volumineux (max 50000 caractères).');
      return;
    }

    try {
      const messageResponse = await fetch('https://localhost:5000/api/users/messages/new', {
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

      if (!messageResponse.ok) throw new Error(`HTTP ${messageResponse.status}`);

      const { id: newMessageId } = await messageResponse.json();

      await uploadFile(newMessage.image, 'image', newMessageId);
      await uploadFile(newMessage.video, 'video', newMessageId);

      setNewMessage({ tittle: '', content: '', image: null, video: null });
      if (imageInputRef.current) imageInputRef.current.value = '';
      if (videoInputRef.current) videoInputRef.current.value = '';
      setErrorMessage('');

      triggerFormatReset();
    } catch (error) {
      console.error('Envoi échoué:', error);
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

      <input
        type="file"
        name="image"
        accept="image/*"
        onChange={handleFileChange}
        ref={imageInputRef}
        style={{ display: 'none' }}
      />
      <input
        type="file"
        name="video"
        accept="video/*"
        onChange={handleFileChange}
        ref={videoInputRef}
        style={{ display: 'none' }}
      />

      <button type="button" onClick={() => imageInputRef.current?.click()}>
        🖼️ Sélectionner une image
      </button>
      <button type="button" onClick={() => videoInputRef.current?.click()}>
        🎥 Sélectionner une vidéo
      </button>

      {(newMessage.image || newMessage.video) && (
        <div style={{
          marginTop: '20px',
          padding: '15px',
          border: '1px solid #ccc',
          borderRadius: '8px',
          backgroundColor: '#f9f9f9'
        }}>
          <h4>🖼️🎬 Fichiers sélectionnés</h4>
          {newMessage.image && (
            <div style={{ marginBottom: '15px' }}>
              <p><strong>Image :</strong> {newMessage.image.name} ({(newMessage.image.size / 1024 / 1024).toFixed(2)} Mo)</p>
              <img
                src={URL.createObjectURL(newMessage.image)}
                alt="Aperçu miniature"
                style={{ maxWidth: '300px', maxHeight: '200px', border: '1px solid #aaa' }}
              />
            </div>
          )}
          {newMessage.video && (
            <div>
              <p><strong>Vidéo :</strong> {newMessage.video.name} ({(newMessage.video.size / 1024 / 1024).toFixed(2)} Mo)</p>
              <video
                controls
                src={URL.createObjectURL(newMessage.video)}
                style={{ maxWidth: '300px', maxHeight: '200px', border: '1px solid #aaa' }}
              />
            </div>
          )}
        </div>
      )}

      <button type="submit">📨 Publier</button>

      {errorMessage && <p style={{ color: 'red' }}><strong>{errorMessage}</strong></p>}
    </form>
  );
};

export default FormArticleThumbnailVideo;
