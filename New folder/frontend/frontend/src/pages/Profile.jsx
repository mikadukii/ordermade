import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Camera } from 'lucide-react';

const Profile = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    bustSize: '',
    waistSize: '',
    hipSize: '',
    profilePicture: '',    
  });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/user/profile', { 
          headers: { Authorization: `Bearer ${token}` }
          });
      
      if (response.data.success) {
        setFormData({
          username: response.data.user.name || '',
          email: response.data.user.email || '',
          password: response.data.user.password || '',
          profilePicture: response.data.user.profilePicture || '',
          bustSize: response.data.user.bustSize || '',
          waistSize: response.data.user.waistSize || '',
          hipSize: response.data.user.hipSize || '',
        });
        if (response.data.user.profilePicture) {
          setImagePreview(response.data.user.profilePicture);
        }
      }
      setIsLoading(false);
    } catch (error) {
      console.error ('Error fetching profile data:', error);
      setMessage({
        type: 'error',
        content: 'Failed to fetch profile data. Please try again later.' + (error.response?.data?.message || '')
      });
      setIsLoading(false);
    }
  };

    fetchProfile();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10000000) { // 10MB limit
        setMessage({
          type: 'error',
          content: 'File size exceeds 10MB limit.'
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData(prev => ({
          ...prev,
          profilePicture: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        'http://localhost:5000/api/user/update-profile',
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setMessage({
          type: 'success',
          content: 'Profile updated successfully!'
        });

        setFormData(prevData => ({
          ...prevData,
          ...response.data.user
        }));

        setTimeout(() => {
          setMessage({ type: '', content: '' });
        }, 3000);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({
        type: 'error',
        content: 'Failed to update profile. Please try again later.' + (error.response?.data?.message || '')
      });
    }
  };

  if(isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
      <div className="text-lg text-gray-600">Loading profile data...</div>
    </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4" data-testid="profile-page">
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="border-b border-gray-200 pb-4 mb-6">
          <h2 className="text-xl font-medium text-gray-900" data-testid="profile-title">
            Update Profile
          </h2>
        </div>

        {message.content && (
          <Alert type={message.type} message={message.content} />
        )}

        {/* Profile Picture */}
        <div className="flex justify-center mb-8">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-300 cursor-pointer" onClick={triggerFileInput}>
              <img
                src={imagePreview || "/src/assets/Profile.png"}
                alt="Profile"
                className="w-full h-full object-cover"
                data-testid="profile-picture"
              />
            </div>
            <button
              type="button"
              onClick={triggerFileInput}
              className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-2 transform translate-x-1/2 translate-y-1/2 hover:bg-blue-600 transition duration-200"
              data-testid="upload-picture-button"
            >
              <Camera size={20}/>
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
              data-testid="photo-input"
            />
          </div>
        </div>

            <form onSubmit={handleSubmit} className="space-y-6" data-testid="profile-form">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-2 md:col-span-1">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Username*
                  </label>
                  <input
                    type="text"
                    id="username"
                    required
                    placeholder="Enter your username"
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg 
                      focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent 
                      transition-all duration-200"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="col-span-2 md:col-span-1">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email*
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    placeholder="Enter your email"
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg 
                      focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent 
                      transition-all duration-200"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="col-span-2 md:col-span-1">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    placeholder="Enter your password"
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg 
                      focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent 
                      transition-all duration-200"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>

                <div className="col-span-2 md:col-span-1">
                  <label htmlFor="bustSize" className="block text-sm font-medium text-gray-700 mb-1">
                    Bust Size*
                  </label>
                  <input
                    type="text"
                    id="bustSize"
                    placeholder="Enter your bust size"
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg 
                      focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent 
                      transition-all duration-200"
                    value={formData.bustSize}
                    onChange={(e) => setFormData({ ...formData, bustSize: e.target.value })}
                  />
                </div>

                <div className="col-span-2 md:col-span-1">
                  <label htmlFor="waistSize" className="block text-sm font-medium text-gray-700 mb-1">
                    Waist Size*
                  </label>
                  <input
                    type="text"
                    id="waistSize"
                    placeholder="Enter your waist size"
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg 
                      focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent 
                      transition-all duration-200"
                    value={formData.waistSize}
                    onChange={(e) => setFormData({ ...formData, waistSize: e.target.value })}
                  />
                </div>

                <div className="col-span-2 md:col-span-1">
                  <label htmlFor="hipSize" className="block text-sm font-medium text-gray-700 mb-1">
                    Hip Size*
                  </label>
                  <input
                    type="text"
                    id="hipSize"
                    placeholder="Enter your hip size"
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg 
                      focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent 
                      transition-all duration-200"
                    value={formData.hipSize}
                    onChange={(e) => setFormData({ ...formData, hipSize: e.target.value })}
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-green-500 text-white font-semibold rounded-lg 
                      hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 
                      focus:ring-offset-2 transition-all duration-200"
                    data-testid="update-profile-button"
                  >
                    Update Profile
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
  );
}

export default Profile;
