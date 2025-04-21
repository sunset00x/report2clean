import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav style={navStyle}>
      <h2 style={logoStyle}>Report2Clean</h2>
      <div style={linkContainerStyle}>
        <Link to="/" style={linkStyle}>Home</Link>
        <Link to="/login" style={linkStyle}>Login</Link>
        <Link to="/report" style={linkStyle}>Submit Report</Link>
        <Link to="/reports" style={linkStyle}>View Reports</Link>
        <Link to="/profile" style={profileButtonStyle}>Profile</Link> {/* ✅ Profile Button */}
      </div>
    </nav>
  );
}

const navStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '16px 32px',
  backgroundColor: '#2c7a7b',
  color: 'white',
};

const logoStyle = {
  fontSize: '24px',
  fontWeight: 'bold',
  margin: 0,
};

const linkContainerStyle = {
  display: 'flex',
  gap: '20px',
};

const linkStyle = {
  textDecoration: 'none',
  color: 'white',
  fontSize: '16px',
};

const profileButtonStyle = {
  ...linkStyle,
  backgroundColor: '#ffffff33',
  padding: '8px 16px',
  borderRadius: '8px',
  fontWeight: 'bold',
};

export default Navbar;
