import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Camera } from 'lucide-react';
import Alert from '../components/Alert.jsx';
import Navbar from '../components/Navbar.jsx';

const EditProfile = () => {
  const [formData, setFormData] = useState({
    username: '',
    bustSize: '',
    waistSize: '',
    hipSize: '',
    profilePicture: '',
  });

  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        if (!userId) {
          setMessage({ type: 'error', content: 'User ID not found. Please log in again.' });
          setIsLoading(false);
          return;
        }

        const response = await axios.get(`http://localhost:3000/get-user-profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success) {
          setFormData({
            username: response.data.user.username || '',
            bustSize: response.data.user.bustSize || '',
            waistSize: response.data.user.waistSize || '',
            hipSize: response.data.user.hipSize || '',
            profilePicture: response.data.user.profilePicture || '',
          });

          if (response.data.user.profilePicture) {
            setImagePreview(response.data.user.profilePicture);
          }
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setMessage({
          type: 'error',
          content: 'Failed to fetch profile. ' + (error.response?.data?.message || ''),
        });
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 10 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData((prev) => ({ ...prev, profilePicture: reader.result }));
      };
      reader.readAsDataURL(file);
    } else {
      setMessage({ type: 'error', content: 'Image too large (max 10MB).' });
    }
  };

  const triggerFileInput = () => fileInputRef.current.click();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (!userId || !token) {
      setMessage({
        type: 'error',
        content: 'User not found or session expired. Please log in again.',
      });
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:3000/edit-profile/${userId}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.message) {
        setMessage({ type: 'success', content: response.data.message });
        setTimeout(() => setMessage({ type: '', content: '' }), 3000);
      }
    } catch (error) {
      setMessage({
        type: 'error',
        content: 'Update failed. ' + (error.response?.data?.message || 'Something went wrong.'),
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col">
        <Navbar />
        <div className="flex-grow flex justify-center items-center h-screen text-gray-600">
          Loading profile...
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center px-4 pt-20">
        <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold text-center mb-6">Edit Profile</h2>

          {message.content && <Alert type={message.type} message={message.content} />}

          <div className="flex justify-center mb-6">
            <div className="relative">
              <div
                className="w-24 h-24 rounded-full overflow-hidden border cursor-pointer"
                onClick={triggerFileInput}
              >
                <img
                  src={imagePreview || "/src/assets/Profile.png"}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={triggerFileInput}
                className="absolute bottom-0 right-0 bg-emerald-500 text-white p-1.5 rounded-full shadow hover:bg-emerald-600"
              >
                <Camera size={16} />
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              required
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-emerald-500"
            />
            <input
              type="text"
              placeholder="Bust Size"
              value={formData.bustSize}
              onChange={(e) => setFormData({ ...formData, bustSize: e.target.value })}
              className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-emerald-500"
            />
            <input
              type="text"
              placeholder="Waist Size"
              value={formData.waistSize}
              onChange={(e) => setFormData({ ...formData, waistSize: e.target.value })}
              className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-emerald-500"
            />
            <input
              type="text"
              placeholder="Hip Size"
              value={formData.hipSize}
              onChange={(e) => setFormData({ ...formData, hipSize: e.target.value })}
              className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600"
            >
              Update Profile
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditProfile;
