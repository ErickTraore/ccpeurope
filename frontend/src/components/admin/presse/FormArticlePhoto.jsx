// File: frontend/src/components/admin/presse/FormArticlePhoto.jsx

import React, { useState, useRef } from 'react';
import { triggerFormatReset } from '../../../utils/formatController';

const USER_API = process.env.REACT_APP_USER_API;
const MEDIA_API = process.env.REACT_APP_MEDIA_API;

const FormArticlePhoto = () => {
  const [newMessage, setNewMessage] = useState({
    tittle: '',
    content: '',
    image: null,
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
      console.log('✅ Image sélectionnée :', file);
      setNewMessage((prevState) => ({ ...prevState, image: file }));
    } else {
      console.error('❌ Aucune image sélectionnée.');
    }
  };

  const uploadImage = async (file, messageId) => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('messageId', messageId);

    try {
      const response = await fetch(`${MEDIA_API}/api/uploadImage`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`❌ Erreur upload image: ${response.status}`);
      }
      console.log('✅ Image envoyée avec succès');
    } catch (error) {
      console.error('❌ Erreur lors de l\'upload de l\'image:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newMessage.tittle || !newMessage.content || !newMessage.image) {
      setErrorMessage('⚠️ Titre, contenu et image sont obligatoires.');
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

      triggerFormatReset();

      if (!messageResponse.ok) {
        throw new Error(`❌ Erreur HTTP ${messageResponse.status}`);
      }

      const { id: newMessageId } = await messageResponse.json();

      await uploadImage(newMessage.image, newMessageId);

      setNewMessage({ tittle: '', content: '', image: null });
      if (fileInputRef.current) fileInputRef.current.value = '';
      setErrorMessage('');
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
        name="image"
        accept="image/*"
        onChange={handleFileChange}
        ref={fileInputRef}
        style={{ display: 'none' }}
      />

      {/* Bouton personnalisé */}
      <button type="button" onClick={() => fileInputRef.current?.click()}>
        📁 Sélectionner une photo
      </button>

      {newMessage.image && (
        <div style={{ marginTop: '10px' }}>
          <p>📷 Aperçu de l’image :</p>
          <img
            src={URL.createObjectURL(newMessage.image)}
            alt="Aperçu"
            style={{ maxWidth: '300px', maxHeight: '200px', border: '1px solid #ccc' }}
          />
        </div>
      )}

      <button type="submit">📸 Publier</button>

      {errorMessage && (
        <p style={{ color: 'red' }}>
          <strong>{errorMessage}</strong>
        </p>
      )}
    </form>
  );
};

export default FormArticlePhoto;
