import React, { useState, useEffect } from 'react';
import { db, storage, auth } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import { FiMapPin, FiCamera, FiCheckCircle } from 'react-icons/fi';
import Navbar from '../components/Navbar'; // ✅ Make sure this path is correct based on your structure

const ReportPage = () => {
  const navigate = useNavigate();
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Get user's current location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation({ lat: latitude, lng: longitude });
      },
      (err) => {
        console.error(err);
        setError('Location access denied. Please enable GPS.');
      }
    );
  }, []);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!auth.currentUser) {
      navigate('/register');
      return;
    }

    if (!description || !location || !image) {
      setError('Please fill in all fields.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const imageRef = ref(storage, `reports/${Date.now()}_${image.name}`);
      await uploadBytes(imageRef, image);
      const imageUrl = await getDownloadURL(imageRef);

      await addDoc(collection(db, 'reports'), {
        userId: auth.currentUser.uid,
        description,
        imageUrl,
        location,
        timestamp: serverTimestamp(),
      });

      setSubmitting(false);
      setSuccess(true);
      setDescription('');
      setImage(null);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      setError('Failed to submit report.');
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />

      <div style={styles.container}>
        <h2 style={styles.heading}>Submit a Cleanliness Report</h2>

        <form style={styles.form} onSubmit={handleSubmit}>
          <textarea
            style={styles.textarea}
            placeholder="Describe the issue..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <label style={styles.uploadLabel}>
            <FiCamera style={{ marginRight: 8 }} />
            Upload Photo
            <input type="file" accept="image/*" style={styles.inputFile} onChange={handleImageChange} />
          </label>

          <div style={styles.locationBox}>
            <FiMapPin />
            <span style={{ marginLeft: 8 }}>
              {location ? `Lat: ${location.lat.toFixed(2)}, Lng: ${location.lng.toFixed(2)}` : 'Fetching location...'}
            </span>
          </div>

          {error && <p style={styles.error}>{error}</p>}
          {success && (
            <p style={styles.success}>
              <FiCheckCircle style={{ marginRight: 5 }} /> Report submitted successfully!
            </p>
          )}

          <button type="submit" style={styles.submitBtn} disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Report'}
          </button>
        </form>
      </div>
    </>
  );
};

const styles = {
  container: {
    maxWidth: 600,
    margin: '40px auto',
    padding: 20,
    border: '1px solid #ddd',
    borderRadius: 8,
    background: '#fff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  textarea: {
    minHeight: 100,
    padding: 10,
    fontSize: 16,
    border: '1px solid #ccc',
    borderRadius: 6,
    resize: 'vertical',
  },
  uploadLabel: {
    display: 'inline-flex',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: '8px 12px',
    borderRadius: 6,
    cursor: 'pointer',
    fontSize: 14,
    color: '#555',
  },
  inputFile: {
    display: 'none',
  },
  locationBox: {
    display: 'flex',
    alignItems: 'center',
    fontSize: 14,
    color: '#444',
  },
  error: {
    color: 'red',
    fontSize: 14,
  },
  success: {
    color: 'green',
    fontSize: 14,
    display: 'flex',
    alignItems: 'center',
  },
  submitBtn: {
    padding: '10px 16px',
    backgroundColor: '#1e88e5',
    color: '#fff',
    fontSize: 16,
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
  },
};

export default ReportPage;
