import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/get-user-profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success) {
          setProfile(response.data.user);
        }
      } catch (err) {
        setMessage('Failed to load profile.');
      }
    };

    fetchProfile();
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center px-4 pt-20">
        <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold text-center mb-6">My Profile</h2>

          {message && <p className="text-red-500">{message}</p>}

          {profile && (
            <div className="space-y-4 text-center">
              <img
                src={profile.profilePicture || '/src/assets/Profile.png'}
                alt="Profile"
                className="w-24 h-24 rounded-full mx-auto object-cover border"
              />
              <p><strong>Username:</strong> {profile.username}</p>
              <p><strong>Bust:</strong> {profile.bustSize || '-'}</p>
              <p><strong>Waist:</strong> {profile.waistSize || '-'}</p>
              <p><strong>Hip:</strong> {profile.hipSize || '-'}</p>
              <button
                className="mt-4 py-2 px-4 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
                onClick={() => window.location.href = '/EditProfile'}
              >
                Edit Profile
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;
