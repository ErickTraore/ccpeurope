// File: frontend/src/components/register/Register.jsx

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../actions/authActions';
import '../auth/AuthForm.scss';

const EMAIL_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
const PASSWORD_REGEX = /^(?=.*\d).{4,20}$/;

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');

    if (!email) {
      setEmailError('Adresse e-mail requise');
      return;
    }

    if (!EMAIL_REGEX.test(email)) {
      setEmailError('Adresse e-mail invalide');
      return;
    }

    if (!password) {
      setPasswordError('Mot de passe requis');
      return;
    }

    if (!PASSWORD_REGEX.test(password)) {
      setPasswordError('Le mot de passe doit contenir entre 4 et 20 caractères et inclure au moins un chiffre');
      return;
    }

    dispatch(registerUser({ email, password }));

  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      {/* Champ Email */}
      <div className="auth-input-group">
        <div className="auth-icon">
          <i className="fas fa-user"></i>
        </div>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className={`auth-input with-icon ${emailError ? 'input-error' : ''}`}
          required
        />
      </div>
      {emailError && <p className="error-message">{emailError}</p>}

      {/* Champ Mot de passe */}
      <div className="auth-input-group">
        <div className="auth-icon">
          <i className="fas fa-lock"></i>
        </div>
        <input
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mot de passe"
          className={`auth-input with-icon ${passwordError ? 'input-error' : ''}`}
          required
        />
        <div
          className="auth-toggle-visibility"
          onClick={() => setShowPassword(!showPassword)}
        >
          <i
            className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'
              } visible`}
          ></i>
        </div>
      </div>
      {passwordError && <p className="error-message">{passwordError}</p>}

      {/* Bouton */}
      <button type="submit" className="auth-submit" disabled={loading}>
        S'inscrire
      </button>

      {/* Messages */}
      {loading && <p>Chargement...</p>}
      {error && <p className="error-message">Erreur : {error}</p>}
    </form>
  );
};

export default Register;
