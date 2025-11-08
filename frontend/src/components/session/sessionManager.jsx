// File: frontend/src/components/session/SessionManager.jsx

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { jwtDecode } from 'jwt-decode';

const USER_API = process.env.REACT_APP_USER_API;
const expiryWarning = parseInt(process.env.REACT_APP_SESSION_EXPIRY_WARNING, 10) || 60;

const SessionManager = () => {
  const dispatch = useDispatch();
  const [timeLeft, setTimeLeft] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalCountdown, setModalCountdown] = useState(expiryWarning);
  const [isExtending, setIsExtending] = useState(false);

  const modalTimerRef = useRef(null);

  const handleLogout = useCallback(() => {
    dispatch({ type: 'LOGOUT' });
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.hash = 'auth';
    window.location.reload();
  }, [dispatch]);

  const getTokenRemainingTime = () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return 0;
    try {
      const decoded = jwtDecode(token);
      const now = Math.floor(Date.now() / 1000);
      if (!decoded.exp || typeof decoded.exp !== 'number') return 0;
      return decoded.exp - now;
    } catch {
      return 0;
    }
  };

  useEffect(() => {
    const syncRemaining = () => {
      const remaining = getTokenRemainingTime();
      if (remaining > 0) {
        setTimeLeft(remaining);
      } else {
        console.warn("Token expiré après extension, mais minuterie relancée");
      }
    };

    // Laisse le temps au token d’être stocké
    const delay = setTimeout(syncRemaining, 100);

    return () => clearTimeout(delay);
  }, [isExtending]);


  useEffect(() => {
    if (timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setShowModal(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  useEffect(() => {
    if (showModal) {
      setModalCountdown(expiryWarning);
      modalTimerRef.current = setInterval(() => {
        setModalCountdown(prev => {
          if (prev <= 1) {
            clearInterval(modalTimerRef.current);
            handleLogout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(modalTimerRef.current);
  }, [showModal, handleLogout]);
  useEffect(() => {
    const syncToken = () => {
      const remaining = getTokenRemainingTime();
      if (remaining <= 0) return handleLogout();
      setTimeLeft(remaining);
    };

    window.addEventListener('storage', syncToken);
    return () => window.removeEventListener('storage', syncToken);
  }, [handleLogout]);
  useEffect(() => {
    if (timeLeft <= expiryWarning && timeLeft > 0 && !showModal) {
      console.log('🔔 Session proche de l’expiration, affichage de la modale');
      setShowModal(true);
    }
  }, [timeLeft, showModal]);


  const handleExtend = async () => {
    console.log('🟡 Tentative de prolongation de session...');
    const refreshToken = localStorage.getItem('refreshToken');
    console.log('🔑 refreshToken récupéré :', refreshToken);
    if (!refreshToken) {
      console.warn('❌ Aucun refreshToken trouvé, déconnexion...');
      return handleLogout();
    }

    setIsExtending(true);

    try {
      const response = await fetch(`${USER_API}/api/users/extend-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${refreshToken}`
        }
      });

      console.log('📡 Réponse reçue du backend :', response);
      const data = await response.json();
      console.log('📦 Contenu JSON reçu :', data);

      if (!response.ok || !data.accessToken) {
        console.warn('❌ Token non reçu ou réponse invalide, déconnexion...');
        return handleLogout();
      }

      localStorage.setItem('accessToken', data.accessToken);
      console.log('✅ Nouveau accessToken stocké :', data.accessToken);

      dispatch({ type: 'LOGIN_SUCCESS', payload: data.accessToken });

      const remaining = getTokenRemainingTime();
      console.log('⏳ Temps restant calculé :', remaining);

      if (!remaining || remaining <= 0) {
        console.warn('❌ Token prolongé mais déjà expiré, déconnexion...');
        return handleLogout();
      }

      setTimeLeft(remaining);
      setShowModal(false);
      clearInterval(modalTimerRef.current); // 🛑 Stoppe le timer de la modale
      modalTimerRef.current = null;
      setIsExtending(false);
      console.log('🟢 Session prolongée avec succès, modale fermée.');
    } catch (err) {
      console.error('❌ Erreur lors de la requête de prolongation :', err);
      setIsExtending(false);
      handleLogout();
    }
  };


  return (
    <>
      {timeLeft > 0 && (
        <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>
          Session expire dans : {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
        </div>
      )}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: '#fff',
          padding: '20px',
          border: '2px solid #333',
          zIndex: 1000
        }}>
          <p>⏰ Votre session va expirer.</p>
          <p style={{ fontWeight: 'bold', color: 'red' }}>
            Déconnexion automatique dans : {modalCountdown} secondes
          </p>
          <button onClick={handleExtend}>Prolonger</button>
          <button onClick={handleLogout}>Déconnecter</button>
        </div>
      )}
    </>
  );
};

export default SessionManager;
