import React, { useState, useEffect } from 'react';
import { db, storage, auth } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import { FiCamera, FiCheckCircle, FiMapPin, FiLoader } from 'react-icons/fi';
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
  const [locationEnabled, setLocationEnabled] = useState(null);

  // Ask for location permission on mount
  useEffect(() => {
    const askForLocation = async () => {
      try {
        const permission = await navigator.permissions.query({ name: 'geolocation' });
        setLocationEnabled(permission.state === 'granted');
        
        if (permission.state === 'granted') {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              const { latitude, longitude } = pos.coords;
              setLocation({ lat: latitude, lng: longitude });
            },
            (err) => {
              console.warn('Location access failed:', err.message);
              setLocationEnabled(false);
            }
          );
        }
      } catch (err) {
        console.warn('Permission API not supported:', err);
        // Fallback to traditional geolocation
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const { latitude, longitude } = pos.coords;
            setLocation({ lat: latitude, lng: longitude });
            setLocationEnabled(true);
          },
          (err) => {
            console.warn('Location permission denied:', err.message);
            setLocationEnabled(false);
          }
        );
      }
    };

    askForLocation();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate image
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      setError('Please upload a JPEG or PNG image');
      return;
    }

    if (file.size > maxSize) {
      setError('Image must be smaller than 5MB');
      return;
    }

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
    setError('');
  };

  const handleLocationPermission = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation({ lat: latitude, lng: longitude });
        setLocationEnabled(true);
      },
      (err) => {
        console.warn('Location permission denied:', err.message);
        setLocationEnabled(false);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!auth.currentUser) {
      navigate('/register');
      return;
    }

    const finalLocation = locationEnabled ? location : manualLocation;
    if (!description || !finalLocation || !image) {
      setError('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      // Upload image
      const imageRef = ref(storage, `reports/${Date.now()}_${image.name}`);
      await uploadBytes(imageRef, image);
      const imageUrl = await getDownloadURL(imageRef);

      // Save report data
      await addDoc(collection(db, 'reports'), {
        userId: auth.currentUser.uid,
        description,
        imageUrl,
        location: locationEnabled ? location : { address: manualLocation },
        timestamp: serverTimestamp(),
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/reportssection');
      }, 1500);
    } catch (err) {
      console.error('Error submitting report:', err);
      setError('Failed to submit report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="report-container">
        <h2 className="report-heading">Submit a Cleanliness Report</h2>

        <form className="report-form" onSubmit={handleSubmit}>
          <textarea
            className="report-textarea"
            placeholder="Describe the issue..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          {locationEnabled === null ? (
            <div className="location-loading">
              <FiLoader className="spinner" />
              <span>Checking location permissions...</span>
            </div>
          ) : locationEnabled ? (
            <div className="location-success">
              <FiMapPin />
              <span>Location detected automatically</span>
            </div>
          ) : (
            <>
              <button
                type="button"
                className="location-btn"
                onClick={handleLocationPermission}
              >
                <FiMapPin /> Enable Location Access
              </button>
              <input
                type="text"
                placeholder="Enter location manually"
                className="report-input"
                value={manualLocation}
                onChange={(e) => setManualLocation(e.target.value)}
                required={!locationEnabled}
              />
            </>
          )}

          <label className="upload-label">
            <FiCamera />
            <span>{image ? 'Change Photo' : 'Upload Photo'}</span>
            <input
              type="file"
              accept="image/*"
              className="input-file"
              onChange={handleImageChange}
              required
            />
          </label>

          {imagePreview && (
            <img src={imagePreview} alt="Report preview" className="preview-image" />
          )}

          {error && <p className="error-message">{error}</p>}
          {success && (
            <p className="success-message">
              <FiCheckCircle /> Report submitted successfully!
            </p>
          )}

          <button
            type="submit"
            className="submit-btn"
            disabled={submitting || success}
          >
            {submitting ? (
              <>
                <FiLoader className="spinner" /> Submitting...
              </>
            ) : (
              'Submit Report'
            )}
          </button>
        </form>
      </div>
    </>
  );
};

// CSS Styles
const styles = `
.report-container {
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.report-heading {
  font-size: 24px;
  margin-bottom: 20px;
  text-align: center;
  color: #333;
}

.report-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.report-textarea {
  min-height: 100px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 6px;
  resize: vertical;
}

.report-input {
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.upload-label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background-color: #f0f0f0;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  color: #555;
  transition: background-color 0.2s;
}

.upload-label:hover {
  background-color: #e0e0e0;
}

.input-file {
  display: none;
}

.preview-image {
  margin-top: 10px;
  max-height: 200px;
  max-width: 100%;
  border-radius: 8px;
}

.error-message {
  color: #d32f2f;
  font-size: 14px;
  margin: 0;
}

.success-message {
  color: #388e3c;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 5px;
  margin: 0;
}

.submit-btn {
  padding: 10px 16px;
  background-color: #1e88e5;
  color: #fff;
  font-size: 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background-color 0.2s;
}

.submit-btn:hover {
  background-color: #1565c0;
}

.submit-btn:disabled {
  background-color: #90caf9;
  cursor: not-allowed;
}

.location-btn {
  padding: 8px 12px;
  background-color: #f5f5f5;
  color: #333;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.location-btn:hover {
  background-color: #eee;
}

.location-success {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #388e3c;
  font-size: 14px;
}

.location-loading {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #555;
  font-size: 14px;
}

.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
`;

// Inject styles
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default ReportPage;