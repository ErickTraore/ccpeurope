// file: stack-zoom/frontend3/src/components/auth/Auth.jsx

import React, { useState } from 'react';
import Login from '../login/Login';
import Register from '../register/Register';
import './Auth.scss';

function Auth() {
  const [activeForm, setActiveForm] = useState('login');

  return (
    <div className="auth-container">
      <h2 className="auth-title">Connexion / Inscription</h2>

      {/* ✅ Conteneur pour les boutons */}
      <div className="auth-toggle">
        <div className="auth-toggle__button">
          <button
            className={activeForm === 'login' ? 'active' : ''}
            onClick={() => setActiveForm('login')}
          >
            Se connecter
          </button>
        </div>
        <div className="auth-toggle__button">
          <button
            className={activeForm === 'register' ? 'active' : ''}
            onClick={() => setActiveForm('register')}
          >
            S'inscrire
          </button>
        </div>
      </div>

      {/* ✅ Zone d'affichage du formulaire */}
      <div className="auth-form">
        {activeForm === 'login' ? <Login /> : <Register />}
      </div>
    </div>
  );
}

export default Auth;
