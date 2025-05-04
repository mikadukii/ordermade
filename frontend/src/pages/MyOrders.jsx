// pages/MyOrders.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:3000/user-orders", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data.orders);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>
      {orders.length === 0 ? (
        <p>You have no orders.</p>
      ) : (
        <div className="grid gap-4">
          {orders.map(order => (
            <div key={order._id} className="p-4 border rounded shadow">
              <h2 className="text-xl font-semibold">{order.servicesId?.title}</h2>
              <p className="text-gray-600">Status: {order.status}</p>
              <p>Description: {order.description}</p>
              {order.referenceImage && (
                <img src={order.referenceImage} alt="reference" className="w-40 mt-2" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
