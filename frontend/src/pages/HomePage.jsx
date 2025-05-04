import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar'; // ✅ Import Navbar
import Header from '../components/Header';
import ExploreServices from '../components/ExploreServices'; // ✅ Import ExploreServices

const HomePage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      axios
        .get('/api/users/me', {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => setUserInfo(res.data))
        .catch(err => {
          console.error(err);
          localStorage.clear(); // optional: logout on error
        });
    }
  }, []);

  return (
    <div>
      <Navbar userInfo={userInfo} /> {/* ✅ Add Navbar with userInfo */}
      <Header />
      <ExploreServices /> 
    </div>
  );
};

export default HomePage;
