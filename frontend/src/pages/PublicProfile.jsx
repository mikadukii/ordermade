import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar.jsx';

const PublicProfile = () => {
  const [userData, setUserData] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');

      try {
        const response = await axios.get('http://localhost:3000/get-user-profile', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success) {
          setUserData(response.data.user);
        } else {
          setMessage('Failed to load profile.');
        }
      } catch (error) {
        setMessage('Something went wrong. ' + (error.response?.data?.message || ''));
      }
    };

    fetchUser();
  }, []);

  if (message) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center h-screen text-red-600 font-medium">
          {message}
        </div>
      </>
    );
  }

  if (!userData) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center h-screen text-gray-600">
          Loading profile...
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center px-4 pt-20">
        <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-md text-center">
          <div className="flex justify-center mb-4">
            <img
              src={userData.profilePicture || '/src/assets/Profile.png'}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border"
            />
          </div>
          <h2 className="text-2xl font-semibold">{userData.username}</h2>
          <div className="mt-4 space-y-1 text-slate-600">
            <p><strong>Bust Size:</strong> {userData.bustSize || '—'}</p>
            <p><strong>Waist Size:</strong> {userData.waistSize || '—'}</p>
            <p><strong>Hip Size:</strong> {userData.hipSize || '—'}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PublicProfile;
