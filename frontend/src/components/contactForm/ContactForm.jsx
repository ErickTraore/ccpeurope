import React, { useState } from 'react';
import './ContactForm.css';
import Messages from '../messages/Messages'; // Importez le composant Messages
import Organigrammes from '../organigrammes/Organigrammes'; // Importez le composant Organigrammes


const ContactForm = () => {
  const [activeSubPage, setActiveSubPage] = useState('adhesion ');

  const navigateToSubPage = (subPage) => {
    setActiveSubPage(subPage);
  };

  return (
    <div className="contact-form">
      <h1>ContactForm</h1>
      <ul className="sub-menu">
        <li onClick={() => navigateToSubPage('messages')}>Messages</li>
        <li onClick={() => navigateToSubPage('organigrammes')}>Organigrammes</li>
      </ul>
      <div className="sub-page-content">
        {activeSubPage === 'messages' && <Messages />}
        {activeSubPage === 'organigrammes' && <Organigrammes />}
      </div>
    </div>
  );
};

export default ContactForm;

