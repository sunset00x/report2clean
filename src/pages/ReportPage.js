import React, { useState, useEffect } from 'react';
import { db, storage, auth } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import { FiCamera, FiCheckCircle, FiMapPin } from 'react-icons/fi';
import Navbar from '../components/Navbar';

const ReportPage = () => {
  const navigate = useNavigate();
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [location, setLocation] = useState(null);
  const [manualLocation, setManualLocation] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Ask for location on mount
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation({ lat: latitude, lng: longitude });
      },
      (err) => {
        console.warn('Location permission denied:', err.message);
        setLocation(null); // fallback to manual input
      }
    );
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!auth.currentUser) {
      navigate('/register');
      return;
    }

    const finalLocation = location || manualLocation;
    if (!description || !finalLocation || !image) {
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
        location: location || { manualLocation },
        timestamp: serverTimestamp(),
      });

      setSubmitting(false);
      setSuccess(true);
      setTimeout(() => {
        navigate('/reportssection');
      }, 1000);
    } catch (err) {
      console.error('Error submitting report:', err);
      setError('Failed to submit report. Please try again.');
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

          {!location && (
            <input
              type="text"
              placeholder="Enter location manually"
              style={styles.input}
              value={manualLocation}
              onChange={(e) => setManualLocation(e.target.value)}
            />
          )}

          <label style={styles.uploadLabel}>
            <FiCamera style={{ marginRight: 8 }} />
            Upload Photo
            <input type="file" accept="image/*" style={styles.inputFile} onChange={handleImageChange} />
          </label>

          {imagePreview && (
            <img src={imagePreview} alt="Report preview" style={styles.previewImage} />
          )}

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
  input: {
    padding: 10,
    fontSize: 14,
    border: '1px solid #ccc',
    borderRadius: 6,
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
  previewImage: {
    marginTop: 10,
    maxHeight: 200,
    borderRadius: 8,
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
