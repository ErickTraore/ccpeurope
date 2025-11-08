import React from 'react';

const HamburgerIcon = ({ isOpen, toggleMenu }) => {
  return (
    <button className="hamburger-icon" onClick={toggleMenu}>
      {isOpen ? '✖' : '☰'}
    </button>
  );
};

export default HamburgerIcon;
