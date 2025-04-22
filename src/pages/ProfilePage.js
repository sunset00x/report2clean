import React, { useEffect, useState } from 'react';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';
import { auth, db } from '../firebase';
import {
  FaUserCircle, FaEnvelope, FaMapMarkerAlt, FaPhoneAlt,
  FaSignOutAlt, FaFileAlt, FaUser, FaClock
} from 'react-icons/fa';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) {
      navigate('/register');
      return;
    }

    const fetchUserData = async () => {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setUserData(userSnap.data());
      }
    };

    fetchUserData();
  }, [user, navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/register');
  };

  if (!userData) {
    return <div style={styles.loading}>Loading profile...</div>;
  }

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <h2 style={styles.logo}>Report2Clean</h2>
        <div style={styles.navLinks}>
          <Link to="/" style={styles.navItem}>Home</Link>
          <Link to="/submit-report" style={styles.navItem}>Submit Report</Link>
          <Link to="/profile" style={{ ...styles.navItem, fontWeight: 'bold' }}>Profile</Link>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            <FaSignOutAlt style={{ marginRight: '6px' }} />
            Logout
          </button>
        </div>
      </nav>

      {/* Main layout */}
      <div style={styles.main}>
        {/* Left section */}
        <div style={styles.left}>
          <div style={styles.avatar}>
            <FaUserCircle size={80} color="#888" />
          </div>
          <h2 style={styles.username}>{userData.fullName}</h2>
          <p style={styles.email}><FaEnvelope /> {user.email}</p>
          <p><FaPhoneAlt /> {userData.phone || 'Not provided'}</p>
          <p><FaMapMarkerAlt /> {userData.city}, {userData.province}</p>
        </div>

        {/* Right section */}
        <div style={styles.right}>
          <h3 style={styles.sectionTitle}><FaUser /> Profile Overview</h3>
          <div style={styles.infoRow}><strong>Name:</strong> {userData.fullName}</div>
          <div style={styles.infoRow}><strong>Address:</strong> {userData.address}</div>
          <div style={styles.infoRow}><strong>Phone:</strong> {userData.phone || 'Not provided'}</div>
          <div style={styles.infoRow}><strong>Province:</strong> {userData.province}</div>
          <div style={styles.infoRow}><strong>City:</strong> {userData.city}</div>
          <div style={styles.infoRow}><FaClock /> Joined on: {new Date(user.metadata.creationTime).toLocaleDateString()}</div>

          <Link to="/myreports" style={styles.reportLink}>
            <FaFileAlt /> View My Reports
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    background: '#f4f6f8',
    minHeight: '100vh',
  },
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    background: '#004c99',
    color: '#fff',
  },
  logo: {
    margin: 0,
    fontSize: '24px',
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.2rem',
  },
  navItem: {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '16px',
  },
  logoutBtn: {
    background: '#e60000',
    color: '#fff',
    padding: '8px 14px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
  },
  main: {
    display: 'flex',
    padding: '2rem',
    gap: '2rem',
  },
  left: {
    flex: '1',
    background: '#fff',
    padding: '1.5rem',
    borderRadius: '8px',
    textAlign: 'center',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
  },
  avatar: {
    marginBottom: '1rem',
  },
  username: {
    marginBottom: '0.5rem',
  },
  email: {
    color: '#555',
    marginBottom: '1rem',
  },
  right: {
    flex: '2',
    background: '#fff',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
  },
  sectionTitle: {
    marginBottom: '1rem',
    fontSize: '20px',
    color: '#004c99',
  },
  infoRow: {
    marginBottom: '0.8rem',
    fontSize: '16px',
  },
  reportLink: {
    marginTop: '1.5rem',
    display: 'inline-block',
    background: '#004c99',
    color: '#fff',
    padding: '10px 16px',
    borderRadius: '6px',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  loading: {
    padding: '2rem',
    textAlign: 'center',
    fontSize: '18px',
  },
};
