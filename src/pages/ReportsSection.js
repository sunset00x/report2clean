import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import Navbar from '../components/Navbar';

function ViewReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const reportsRef = collection(db, 'reports');
        const q = query(reportsRef, orderBy('timestamp', 'desc'));
        const snapshot = await getDocs(q);
        const fetchedReports = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setReports(fetchedReports);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching reports:', error);
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  return (
    <>
      <Navbar />
      <div style={containerStyle}>
        <h2 style={headingStyle}>📋 Submitted Reports</h2>
        {loading ? (
          <p>Loading reports...</p>
        ) : reports.length === 0 ? (
          <p>No reports submitted yet.</p>
        ) : (
          <div style={gridStyle}>
            {reports.map((report) => (
              <div key={report.id} style={cardStyle}>
                {report.imageUrl && (
                  <img src={report.imageUrl} alt="report" style={imageStyle} />
                )}
                <div style={infoStyle}>
                  <h3 style={titleStyle}>{report.description}</h3>
                  <p style={locationStyle}>📍 {report.location || 'Unknown location'}</p>
                  <p style={metaStyle}>
                    Submitted by: <strong>{report.userName || 'Anonymous'}</strong>
                  </p>
                  <p style={metaStyle}>
                    Date: {report.timestamp?.toDate().toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

// 🔧 Styles
const containerStyle = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '40px 20px',
};

const headingStyle = {
  fontSize: '28px',
  marginBottom: '30px',
  textAlign: 'center',
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: '20px',
};

const cardStyle = {
  border: '1px solid #ccc',
  borderRadius: '10px',
  overflow: 'hidden',
  backgroundColor: '#f9f9f9',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
};

const imageStyle = {
  width: '100%',
  height: '200px',
  objectFit: 'cover',
};

const infoStyle = {
  padding: '16px',
};

const titleStyle = {
  fontSize: '18px',
  fontWeight: '600',
  marginBottom: '10px',
};

const locationStyle = {
  color: '#2c7a7b',
  fontWeight: '500',
  marginBottom: '8px',
};

const metaStyle = {
  fontSize: '14px',
  color: '#555',
};

export default ViewReportsPage;
