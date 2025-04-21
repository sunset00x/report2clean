import React from 'react';
import Navbar from '../components/Navbar';
import { FaGoogle, FaFacebookF, FaGithub, FaInstagram } from 'react-icons/fa';

const LoginPage = () => {
  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.loginBox}>
          <h2 style={styles.title}>Be a part in tackling the environment</h2>

          <div style={styles.socialButtons}>
            <button style={{ ...styles.socialBtn, backgroundColor: '#4285F4' }}>
              <FaGoogle style={styles.icon} /> Sign in with Google
            </button>
            <button style={{ ...styles.socialBtn, backgroundColor: '#3b5998' }}>
              <FaFacebookF style={styles.icon} /> Sign in with Facebook
            </button>
            <button style={{ ...styles.socialBtn, backgroundColor: '#333' }}>
              <FaGithub style={styles.icon} /> Sign in with GitHub
            </button>
            <button style={{ ...styles.socialBtn, backgroundColor: '#e4405f' }}>
              <FaInstagram style={styles.icon} /> Sign in with Instagram
            </button>
          </div>

          <div style={styles.divider}><span>OR</span></div>

          <form style={styles.form}>
            <label>Email</label>
            <input type="email" placeholder="Enter email" style={styles.input} />

            <label>Password</label>
            <input type="password" placeholder="Enter password" style={styles.input} />

            <button type="submit" style={styles.loginButton}>Login</button>
          </form>

          <p style={styles.footerText}>
            Don’t have an account? <a href="/register" style={styles.link}>Register</a>
          </p>
        </div>
      </div>
    </>
  );
};

const styles = {
  container: {
    background: '#f4f7fa',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: '40px',
  },
  loginBox: {
    background: '#fff',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center',
  },
  title: {
    fontSize: '22px',
    marginBottom: '25px',
    color: '#2c3e50',
  },
  socialButtons: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  socialBtn: {
    color: 'white',
    padding: '12px',
    borderRadius: '6px',
    border: 'none',
    fontSize: '15px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
  },
  icon: {
    fontSize: '18px',
  },
  divider: {
    margin: '20px 0',
    position: 'relative',
    textAlign: 'center',
    color: '#888',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left',
  },
  input: {
    padding: '10px',
    marginTop: '8px',
    marginBottom: '16px',
    border: '1px solid #ccc',
    borderRadius: '6px',
    fontSize: '14px',
  },
  loginButton: {
    backgroundColor: '#319795',
    color: 'white',
    padding: '12px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    marginTop: '10px',
  },
  footerText: {
    marginTop: '20px',
    fontSize: '14px',
    color: '#555',
  },
  link: {
    color: '#319795',
    textDecoration: 'none',
    fontWeight: '600',
  },
};

export default LoginPage;
