import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import Navbar from '../components/Navbar';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    province: "",
    district: "",
    city: "",
    address: "",
    phone: "",
  });
  const [error, setError] = useState("");
  
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);
  
  const provinces = [
    "Koshi",
    "Madhesh",
    "Bagmati",
    "Gandaki",
    "Lumbini",
    "Karnali",
    "Sudurpashchim"
  ];

  const provinceDistrictCityData = {
    "Koshi": {
      districts: ["Bhojpur", "Dhankuta", "Ilam", "Jhapa", "Khotang", "Morang", "Okhaldhunga", "Panchthar", "Sankhuwasabha", "Solukhumbu", "Sunsari", "Taplejung", "Terhathum", "Udayapur"],
      cities: ["Biratnagar", "Ilam", "Dharan", "Bhadrapur"]
    },
    "Madhesh": {
      districts: ["Bara", "Dhanusha", "Mahottari", "Parsa", "Rautahat", "Sarlahi", "Saptari", "Siraha"],
      cities: ["Birgunj", "Janakpur", "Lahan"]
    },
    "Bagmati": {
      districts: ["Bhaktapur", "Chitwan", "Kathmandu", "Lalitpur", "Makawanpur", "Ramechhap", "Sindhuli", "Sindhupalchok"],
      cities: ["Kathmandu", "Patan", "Bhaktapur"]
    },
    "Gandaki": {
      districts: ["Kaski", "Gorkha", "Lamjung", "Manang", "Madhya", "Myagdi", "Parbat", "Syangja", "Tanahu"],
      cities: ["Pokhara", "Bandipur"]
    },
    "Lumbini": {
      districts: ["Arghakhanchi", "Banke", "Bardiya", "Dang", "Gulmi", "Kapilvastu", "Nawalparasi", "Palpa", "Rupandehi", "Salyan", "Surkhet"],
      cities: ["Butwal", "Lumbini"]
    },
    "Karnali": {
      districts: ["Bardiya", "Dailekh", "Dolpa", "Humla", "Jajarkot", "Jagadishpur", "Kalikot", "Mugu", "Rukum", "Salyan", "Surkhet", "Gulmi", "Baglung"],
      cities: ["Surkhet", "Nepalgunj"]
    },
    "Sudurpashchim": {
      districts: ["Achham", "Baitadi", "Bajhang", "Bajura", "Doti", "Dolpa", "Kailali", "Kanchanpur", "Far Western Region"],
      cities: ["Dhangadhi", "Mahendranagar"]
    },
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleProvinceChange = (province) => {
    setFormData((prev) => ({ ...prev, province, district: "", city: "" }));
    setDistricts(provinceDistrictCityData[province]?.districts || []);
    setCities([]); // Reset cities when province changes
  };

 
  const handleDistrictChange = (district) => {
    setFormData((prev) => ({ ...prev, district, city: "" })); 
    setCities([]); 
    const provinceData = provinceDistrictCityData[formData.province]; 
    if (provinceData) {
      if (provinceData.districts.includes(district)) {
        setCities(provinceData.cities || []);  
      }
    }
  };
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { fullName, email, password, confirmPassword, province, district, city, address, phone } = formData;

    if (!fullName || !email || !password || !confirmPassword || !province || !district || !city || !address || !phone) {
      setError("Please fill all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", res.user.uid), {
        fullName,
        email,
        phone,
        province,
        district,
        city,
        address,
        createdAt: new Date(),
      });
      navigate("/profile");
    } catch (err) {
      setError("Registration failed. Try again.");
      console.error(err);
    }
  };

  const handleSocialLogin = async (provider) => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      await setDoc(doc(db, "users", user.uid), {
        fullName: user.displayName || "",
        email: user.email,
        phone: user.phoneNumber || "",
        province: "",
        district: "",
        city: "",
        address: "",
        createdAt: new Date(),
      });

      navigate("/profile");
    } catch (err) {
      console.error("Social login failed", err);
      setError("Social login failed.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="register-container">
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Register to Report2Clean</h2>
        <form className="register-form" onSubmit={handleSubmit}>
          <input type="text" name="fullName" placeholder="Full Name" onChange={handleChange} />
          <input type="email" name="email" placeholder="Email Address" onChange={handleChange} />
          <input type="tel" name="phone" placeholder="Phone Number" onChange={handleChange} />
          <select name="province" value={formData.province} onChange={(e) => handleProvinceChange(e.target.value)}>
            <option value="">Select Province</option>
            {provinces.map((province, index) => (
              <option key={index} value={province}>{province}</option>
            ))}
          </select>
          <select name="district" value={formData.district} onChange={(e) => handleDistrictChange(e.target.value)} disabled={!formData.province}>
            <option value="">Select District</option>
            {districts.map((district, index) => (
              <option key={index} value={district}>{district}</option>
            ))}
          </select>
          <select name="city" value={formData.city} onChange={handleChange} disabled={!formData.district}>
            <option value="">Select City</option>
            {cities.map((city, index) => (
              <option key={index} value={city}>{city}</option>
            ))}
          </select>
          <input type="text" name="address" placeholder="Address" onChange={handleChange} />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} />
          <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} />
          <button type="submit">Register</button>
        </form>

        <div className="social-login">
          <p>Or Sign Up Using</p>
          <button className="google-btn" onClick={() => handleSocialLogin(new GoogleAuthProvider())}>
            <img src="https://img.icons8.com/color/16/google-logo.png" alt="Google" /> Google
          </button>
          <button className="facebook-btn" onClick={() => handleSocialLogin(new FacebookAuthProvider())}>
            <img src="https://img.icons8.com/ios-filled/16/ffffff/facebook--v1.png" alt="Facebook" /> Facebook
          </button>
        </div>

        {error && <p className="error">{error}</p>}
      </div>

      <style jsx="true">{`
        .register-container {
          max-width: 500px;
          margin: 30px auto;
          background: #fff;
          padding: 30px;
          border-radius: 15px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          font-family: 'Poppins', sans-serif;
        }

        .register-form input,
        .register-form select {
          display: block;
          width: 100%;
          padding: 12px;
          margin: 12px 0;
          border: 1px solid #ccc;
          border-radius: 8px;
          font-size: 16px;
        }

        .register-form button {
          padding: 12px;
          width: 100%;
          background-color: #2c7a7b;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: bold;
          font-size: 16px;
          margin-top: 10px;
        }

        .register-form button:hover {
          background-color: #226568;
        }

        .social-login {
          text-align: center;
          margin-top: 20px;
        }

        .social-login p {
          margin-bottom: 10px;
          font-weight: 500;
        }

        .social-login button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 10px;
          width: 100%;
          margin: 5px 0;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }
      `}</style>
    </>
  );
};

export default RegisterPage;
