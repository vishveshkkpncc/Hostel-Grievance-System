import React from 'react';
import {Link} from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home-container">
      <div className="overlay">
        <div className="header">
          <div className="logo-section">
            <img src="VNIT_logo.png" alt="Logo" className="logo" />
            <div className="institute-info">
              <h2>Visvesvaraya National Institute of Technology</h2>
              <h2>Nagpur, India</h2>
            </div>
          </div>
          <div className="portal-heading">
            <h1>Complaint Portal</h1>
          </div>
        </div>
        <div className="bottom-section">
          <div className="options">
            <Link to="/worker/civil" className="option">
              <h2>Civil Complaints</h2>
            </Link>
            <Link to="/worker/electrical" className="option">
              <h2>Electrical Complaints</h2>
            </Link>
            <Link to="/worker/lan" className="option">
              <h2>LAN Complaints</h2>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}


export default Home;
