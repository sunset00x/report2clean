import React from 'react';
import Navbar from '../components/Navbar';  // Importing the Navbar component

function HomePage() {
  return (
    <div>
      {/* Navbar is placed at the top of the page */}
      <Navbar />

      {/* Hero section */}
      <section style={heroSectionStyle}>
        <h2>Welcome to Report2Clean</h2>
        <p>Let's clean our city together by reporting and tracking issues!</p>

        {/* Action buttons */}
        <div style={actionButtonsStyle}>
          <button style={buttonStyle}>Login</button>
          <button style={buttonStyle}>Submit Report</button>
          <button style={buttonStyle}>View Reports</button>
        </div>
      </section>

      {/* Features section */}
      <section style={featuresSectionStyle}>
        <h3>Why Report?</h3>
        <div style={featuresWrapperStyle}>
          <div style={featureCardStyle}>
            <h4>Report Issues</h4>
            <p>Quickly upload photos, videos, and descriptions of local issues.</p>
          </div>
          <div style={featureCardStyle}>
            <h4>Track Progress</h4>
            <p>See how your reports contribute to cleaner streets.</p>
          </div>
          <div style={featureCardStyle}>
            <h4>Earn Rewards</h4>
            <p>Receive incentives for active participation in keeping our city clean.</p>
          </div>
        </div>
      </section>

      {/* Map section */}
      <section style={mapSectionStyle}>
        <h3>Live Report Map</h3>
        <div style={mapContainerStyle}>
          <iframe 
            title="Map"
            src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3532.812046368325!2d87.27056361453339!3d26.45247419650686!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2snp!4v1712922890925!5m2!1sen!2snp"
            width="100%" height="400" style={{ border: 0 }} allowFullScreen="" loading="lazy" />
        </div>
      </section>

      {/* About section */}
      <section style={aboutSectionStyle}>
        <h3>About Report2Clean</h3>
        <p>Report2Clean is a community-driven initiative to help make Biratnagar cleaner and safer by enabling citizens to report unhygienic acts. Each report is a step towards a cleaner city.</p>
      </section>

      {/* Footer */}
      <footer style={footerStyle}>
        <p><strong>Report2Clean</strong> — Report. Act. Clean.</p>
        <p>Created for a cleaner Biratnagar</p>
      </footer>
    </div>
  );
}

// Styles for different sections of the page
const heroSectionStyle = {
  textAlign: 'center',
  padding: '60px 20px',
  backgroundColor: '#38a169',
  color: 'white',
};

const actionButtonsStyle = {
  marginTop: '20px',
};

const buttonStyle = {
  padding: '12px 20px',
  fontSize: '16px',
  border: 'none',
  borderRadius: '6px',
  backgroundColor: '#2c7a7b',
  color: 'white',
  cursor: 'pointer',
  margin: '0 10px',
};

const featuresSectionStyle = {
  padding: '40px 20px',
  textAlign: 'center',
  backgroundColor: '#f0f4f8',
};

const featuresWrapperStyle = {
  display: 'flex',
  justifyContent: 'space-around',
  marginTop: '30px',
};

const featureCardStyle = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  width: '30%',
};

const mapSectionStyle = {
  padding: '40px 20px',
  backgroundColor: '#fff',
};

const mapContainerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '8px',
  overflow: 'hidden',
};

const aboutSectionStyle = {
  padding: '40px 20px',
  textAlign: 'center',
  backgroundColor: '#f0f4f8',
};

const footerStyle = {
  backgroundColor: '#2c7a7b',
  color: 'white',
  textAlign: 'center',
  padding: '20px 0',
};

export default HomePage;
