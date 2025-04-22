import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db, storage } from '../firebase';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
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
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [error, setError] = useState("");
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);

  const provinces = ["Koshi", "Madhesh", "Bagmati", "Gandaki", "Lumbini", "Karnali", "Sudurpashchim"];

  const provinceDistrictCityData = {
    Koshi: {
      districts: {
        Ilam: ["Ilam"],
        Jhapa: ["Birtamod", "Damak", "Mechinagar", "Belbari", "Sundar Haraincha", "Urlabari", "Ratuwamai", "Pathari Shanischare", "Garuda", "Gauradaha"],
        Khotang: ["Diktel"],
        Morang: ["Biratnagar", "Budhiganga", "Mechinagar", "Belbari", "Sundar Haraincha", "Urlabari", "Ratuwamai", "Pathari Shanischare", "Garuda", "Gauradaha"],
        Okhaldhunga: ["Okhaldhunga"],
        Panchthar: ["Phidim"],
        Sankhuwasabha: ["Khandbari"],
        Solukhumbu: ["Salleri"],
        Sunsari: ["Itahari", "Dharan", "Inaruwa", "Ramdhuni", "Duhabi"]
      }
    },
    // ... rest of province data
    Madhesh: { districts: { Bara: ["Kalaiya", "Nijgadh"] } },
    Bagmati: { districts: { Kathmandu: ["Kathmandu"] } },
    Gandaki: { districts: { Kaski: ["Pokhara"] } },
    Lumbini: { districts: { Dang: ["Ghorahi"] } },
    Karnali: { districts: { Dailekh: ["Dailekh"] } },
    Sudurpashchim: { districts: { Kailali: ["Dhangadhi"] } }
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleProvinceChange = (province) => {
    setFormData(prev => ({ ...prev, province, district: "", city: "" }));
    setDistricts(Object.keys(provinceDistrictCityData[province]?.districts || {}));
    setCities([]);
  };

  const handleDistrictChange = (district) => {
    setFormData(prev => ({ ...prev, district, city: "" }));
    const provinceData = provinceDistrictCityData[formData.province];
    if (provinceData?.districts[district]) {
      setCities(provinceData.districts[district]);
    } else {
      setCities([]);
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
      let photoURL = "";

      if (profilePhoto) {
        const photoRef = ref(storage, `profilePhotos/${res.user.uid}`);
        await uploadBytes(photoRef, profilePhoto);
        photoURL = await getDownloadURL(photoRef);
      }

      await setDoc(doc(db, "users", res.user.uid), {
        fullName,
        email,
        phone,
        province,
        district,
        city,
        address,
        photoURL,
        createdAt: new Date(),
      });

      navigate("/profile");
    } catch (err) {
      console.error(err);
      setError("Registration failed. Try again.");
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
        photoURL: user.photoURL || "",
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

          {/* Profile Photo Upload */}
          <input type="file" accept="image/*" onChange={(e) => setProfilePhoto(e.target.files[0])} />
          
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
    </>
  );
};

export default RegisterPage;
