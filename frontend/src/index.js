// File: frontend/src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom'; // ✅ Ajouté ici
import store from './store';
import './index.css';
import App from './app/App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}> 
      <BrowserRouter> {/* ✅ Ajouté ici */}
        <App /> 
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();

