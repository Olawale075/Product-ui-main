import React from 'react';
import './whatsapp.css';

const Whatsapp = () => {
  return (
    <div className="whatsapp_container">
      <a
        href="https://wa.me/2349048247745?text=Hi%2C%20I%20want%20to%20get%20my%20Mac%20Address"
        className="whatsapp_float"
        target="_blank"
        rel="noopener noreferrer"
      >
        <i className="fa fa-whatsapp whatsapp-icon"></i>
      </a>
      <p className="whatsapp_text">Click here to get your Mac Address</p>
    </div>
  );
};

export default Whatsapp;
