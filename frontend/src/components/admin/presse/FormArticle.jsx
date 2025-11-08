// File: frontend/src/components/admin/presse/FormArticle.jsx


import React, { useState } from 'react';

const USER_API = process.env.REACT_APP_USER_API;
const MEDIA_API = process.env.REACT_APP_MEDIA_API;

const FormArticle = () => {
  const [newMessage, setNewMessage] = useState({
    tittle: '',
    content: '',
  });
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e) => {
    setNewMessage({ ...newMessage, [e.target.name]: e.target.value });
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newMessage.tittle || !newMessage.content) {
      setErrorMessage('⚠️ Un titre et un contenu sont obligatoires.');
      return;
    }

    if (newMessage.content.length > 50000) {
      setErrorMessage('⚠️ Le contenu est trop volumineux (max 50000 caractères).');
      return;
    }

    try {
      const response = await fetch(`${USER_API}/api/users/messages/new`, {
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

      if (!response.ok) {
        throw new Error(`❌ Erreur HTTP ${response.status}`);
      }

      setNewMessage({ tittle: '', content: '' });
      setErrorMessage('');
    } catch (error) {
      console.error("❌ Erreur lors de l'envoi:", error);
      setErrorMessage("⚠️ Une erreur est survenue lors de l'envoi.");
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
      <button type="submit">🚀 Envoyer</button>
      {errorMessage && <p style={{ color: 'red' }}><strong>{errorMessage}</strong></p>}
    </form>
  );
};

export default FormArticle;
