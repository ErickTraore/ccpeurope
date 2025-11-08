// file: frontend/src/components/auth/Auth.jsx

import React, { useState } from 'react';
import Login from '../login/Login';
import Register from '../register/Register';
import './Auth.scss';

function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="auth-container">

      {/* ✅ Boutons de bascule */}
      <div className="auth-toggle">
        <button
          className={isLogin ? 'active' : ''}
          onClick={() => setIsLogin(true)}
        >
          Connexion
        </button>
        <button
          className={!isLogin ? 'active' : ''}
          onClick={() => setIsLogin(false)}
        >
          Inscription
        </button>
        
      </div>

      {/* ✅ Zone d'affichage du bon formulaire */}
      <div className="auth-form">
              <h4 className="auth-title">{isLogin ? 'Je me connecte' : 'Je m\'inscris'}</h4>

        {isLogin ? <Login /> : <Register />}
      </div>
    </div>
  );
}

export default Auth;
