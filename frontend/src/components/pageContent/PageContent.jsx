// File: stack-zoom/frontend/src/components/pageContent/PageContent.jsx

import React from 'react';
import Auth from '../auth/Auth';
import Register from '../register/Register';
import '../pageContent/PageContent.css';
import Home from '../home/Home';
import ContactForm from '../contactForm/ContactForm';
import Attestation from '../attestation/Attestation';
import Login from '../login/Login';
import Zoompage from '../zoompage/Zoompage';
import Messages from '../messages/Messages';
import MessageList from "../messagelist/MessageList";
import Presse from '../admin/presse/Presse';
import ProfilePage from '../profilepage/ProfilePage';

const PageContent = ({ activePage }) => {
  return (
    <div className="content" key={activePage}>
      {activePage === 'home' && <Home/>}
      {activePage === 'auth' && <Auth />}
      {activePage === 'register' && <Register />}
      {activePage === 'contact' && <ContactForm />}
      {activePage === 'login' && <Login />} 
      {activePage === 'attestation' && <Attestation />} 
      {activePage === 'zoompage' && <Zoompage />} 
      {activePage === 'messages' && <Messages />}
      {activePage === 'messagelist' && <MessageList/>}
      {activePage === 'presse' && <Presse />}
      {activePage === 'profilepage' && <ProfilePage userId={1} />} 
    </div>
  );
};

export default PageContent;
