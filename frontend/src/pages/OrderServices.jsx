import React, { useContext, useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';

const OrderServices = () => {
  const { servicesId } = useParams();
  const { services } = useContext(AppContext);
  const [servicesInfo, setServicesInfo] = useState(null);
  const [orderData, setOrderData] = useState({
    title: '',
    description: '',
    referenceImage: ''
  });
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchServicesInfo = () => {
      const matchedService = services.find(service => service._id === servicesId);
      if (matchedService) {
        setServicesInfo(matchedService);
      }
    };
    fetchServicesInfo();
  }, [services, servicesId]);

  const handleInputChange = (e) => {
    setOrderData({ ...orderData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 10 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setOrderData({ ...orderData, referenceImage: reader.result });
      };
      reader.readAsDataURL(file);
    } else {
      setMessage('Image too large (max 10MB).');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (!token || !userId) {
      setMessage('Please log in to place an order.');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:3000/place-order',
        {
          ...orderData,
          serviceId: servicesId,
          userId
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('Order placed successfully!');
      setOrderData({ title: '', description: '', referenceImage: '' });
      setImagePreview(null);
    } catch (err) {
      setMessage('Failed to place order.');
      console.error(err);
    }
  };

  return (
    <div className='px-4 py-10 max-w-3xl mx-auto'>
      <h1 className='text-2xl font-bold mb-6 text-center'>Order Services</h1>

      {servicesInfo && (
        <div className='mb-10'>
          <h2 className='text-xl font-semibold'>Service Details</h2>
          <p className='text-lg mt-2'>Title: {servicesInfo.title}</p>
          <p className='text-lg'>Description: {servicesInfo.description}</p>
          <p className='text-lg'>Price: {servicesInfo.price}</p>
          <p className='text-lg'>Category: {servicesInfo.category}</p>
          <img src={servicesInfo.imageURL} alt={servicesInfo.title} className='w-64 h-64 object-cover mt-4' />
        </div>
      )}

      <h2 className='text-xl font-semibold mb-4'>Place Your Custom Order</h2>

      {message && <p className='mb-4 text-red-600'>{message}</p>}

      <form onSubmit={handleSubmit} className='space-y-4'>
        <input
          type='text'
          name='title'
          placeholder='Your order title'
          value={orderData.title}
          onChange={handleInputChange}
          className='w-full px-4 py-2 border rounded-lg'
          required
        />
        <textarea
          name='description'
          placeholder='Order description'
          value={orderData.description}
          onChange={handleInputChange}
          className='w-full px-4 py-2 border rounded-lg'
          rows={4}
          required
        />
        <div>
          <p className='mb-2 font-medium'>Reference Image:</p>
          <div
            onClick={() => fileInputRef.current.click()}
            className='w-40 h-40 border-dashed border-2 flex items-center justify-center rounded-lg cursor-pointer'
          >
            {imagePreview ? (
              <img src={imagePreview} alt='Preview' className='object-cover w-full h-full rounded-lg' />
            ) : (
              <span className='text-gray-500'>Click to upload</span>
            )}
          </div>
          <input
            type='file'
            accept='image/*'
            ref={fileInputRef}
            onChange={handleImageChange}
            className='hidden'
          />
        </div>
        <button
          type='submit'
          className='w-full py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700'
        >
          Submit Order
        </button>
      </form>
    </div>
  );
};

export default OrderServices;
