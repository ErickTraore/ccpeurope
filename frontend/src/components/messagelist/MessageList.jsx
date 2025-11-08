// File: frontend/src/components/messages/MessageList.jsx

import React, { useEffect, useState } from 'react'; 
import { useDispatch, useSelector } from 'react-redux'; 
import { fetchMessages } from '../../actions/messageActions'; 
import '../messagelist/MessageList.css';

const USER_API = process.env.REACT_APP_USER_API;
const MEDIA_API = process.env.REACT_APP_MEDIA_API;

const MEDIA_BACKEND_URL =`${MEDIA_API}/api/getMedia`;

const getMessageViewType = (message) => {
  const hasImage = Array.isArray(message.media) && message.media.some((m) => 
    m.type === 'image'
); 
const hasVideo = Array.isArray(message.media) && message.media.some((m) => 
  m.type === 'video');

  let pressetype = '';

  if (!hasImage && !hasVideo) { pressetype = 'text-only'; 

  } else if (hasImage && !hasVideo) { pressetype = 'image-only'; 
    
  } else if (!hasImage && hasVideo) { pressetype = 'video-only'; } else if (hasImage && hasVideo) { pressetype = 'image-and-video'; }

  return pressetype;
};

const MessageList = () => {
  const dispatch = useDispatch(); 
  const messages = useSelector((state) => state.messages.messages); 
  const [activeMessageId, setActiveMessageId] = useState(null); 
  const [activeImageId, setActiveImageId] = useState(null);

  const toggleText = (id) => { setActiveMessageId((prevId) => (prevId === id ? null : id)); };

  const isActive = (id) => activeMessageId === id;

  const toggleImageText = (id) => { setActiveImageId((prevId) => (prevId === id ? null : id)); };

  const isImageActive = (id) => activeImageId === id;

  useEffect(() => { dispatch(fetchMessages()); }, [dispatch]);

  useEffect(() => {
    if (!messages || messages.length === 0) return;

    const validMessages = Array.isArray(messages)
      ? messages.filter((msg) => msg && msg.id)
      : [];

    if (validMessages.length === 0) return;

    const fetchMediaForMessages = async () => {
      try {
        const enrichedMessages = await Promise.all(
          validMessages.map(async (message) => {
            console.log(`${MEDIA_BACKEND_URL}/${message.id}`)
            const response = await fetch(`${MEDIA_BACKEND_URL}/${message.id}`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            });
            if (!response.ok) {
              return { ...message, media: [] };
            }
            const mediaData = await response.json();
            return { ...message, media: mediaData || [] };
          })
        );

        dispatch({ type: 'UPDATE_MESSAGES', payload: enrichedMessages });
      } catch (error) {
        console.error('Erreur lors du fetch des médias :', error);
      }
    };

    fetchMediaForMessages();

  }, [messages]);

  return (
    <div>
      <div className="presse">
          📝 Presse PPA-CI
      </div>
      <div className="messagelist"> 
        {!Array.isArray(messages) || messages === undefined ? (
          <p className="error-message">⚠️ Erreur : données des messages non disponibles.</p>
        ) : messages.length === 0 ? (
          <div className="no-message">
            <h3>📭 Aucun message pour le moment</h3>
            <p>Connectez-vous pour publier le premier message.</p>
          </div>
        ) : (
          messages.map((message) => {
            const pressetype = getMessageViewType(message);

            return (
              <div key={message.id} className={`message-card ${pressetype} ${isImageActive(message.id) ? 'active' : ''}`}>              
                {pressetype === 'text-only' && (
                  <>
                    <h3 onClick={() => toggleText(message.id)}>{message.tittle}</h3>
                    {isActive(message.id) && (
                      <>
                        <p>{message.content}</p>
                        <p className="author">
                          Expédié par : {message.User?.email || 'Utilisateur inconnu'} <span className="created-date">({new Date(message.createdAt).toLocaleString()})</span>
                        </p>
                      </>
                    )}
                  </>
                )}

                {pressetype === 'image-only' && (
                  <>
                    <div className="media-grid">
                      {message.media.map((file, index) => (
                        <div key={file.filename} className="media-item">
                          {index === 0 && (
                            <h3 onClick={() => toggleImageText(message.id)}>{message.tittle}</h3>
                          )}
                          <img src={`${MEDIA_API}/api/uploads/images/${file.filename}`} alt="Message media" />
                        </div>
                      ))}
                    </div>
                    <div className="media-content">
                      <p>{message.content}</p>
                      <p className="author">Expédié par : {message.User?.email || 'Utilisateur inconnu'} <span className="created-date">({new Date(message.createdAt).toLocaleString()})</span></p>
                    </div>
                  </>
                )}

                {(pressetype === 'video-only' || pressetype === 'image-and-video') && (
                  <>
                    <div className="media-grid">
                      {message.media?.map((file, index) => (
                        <div key={file.filename} className="media-item">
                          {index === 0 && <h3>{message.tittle}</h3>}
                          {file.type === 'image' ? (
                            <img
                              src={`${MEDIA_API}/api/uploads/images/${file.filename}`}
                              alt="Message media"
                            />
                          ) : (
                            <video controls>
                              <source
                                src={`${MEDIA_API}/api/uploads/videos/${file.filename}`}
                                type="video/mp4"
                              />
                              Votre navigateur ne supporte pas la lecture des vidéos.
                            </video>
                          )}
                        </div>
                      ))}
                    </div>
                    <p>{message.content}</p>
                    <p className="author">
                      Expédié par : {message.User?.email || 'Utilisateur inconnu'} <span className="created-date">({new Date(message.createdAt).toLocaleString()})</span>
                    </p>
                  </>
                )}

                {pressetype !== 'text-only' &&
                  pressetype !== 'image-only' &&
                  pressetype !== 'video-only' &&
                  pressetype !== 'image-and-video' && (
                    <p>⚠️ Type de message inconnu ou mal structuré.</p>
                  )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MessageList;