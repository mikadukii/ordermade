import React, { useState, useEffect } from "react";
import axios from "axios";

const UserDashboard = () => {
  const [email, setEmail] = useState(""); // Store user's email
  const [services, setServices] = useState([]); // Store available services
  const [selectedService, setSelectedService] = useState(""); // Store selected service
  const [requests, setRequests] = useState([]); // Store fetched requests

  // Fetch available services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/services");
        setServices(res.data);
      } catch (err) {
        console.error("Error fetching services:", err);
      }
    };

    fetchServices();
  }, []);

  // Function to fetch user's requests
  const fetchRequests = async () => {
    if (!email || !selectedService) return;
    try {
      const res = await axios.get(
        `http://localhost:5000/api/requests/user/${email}?service=${selectedService}`
      );
      setRequests(res.data);
    } catch (err) {
      console.error("Error fetching requests:", err);
    }
  };

  return (
    <div>
      <h2>Check Your Request Status</h2>

      {/* Email Input */}
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      {/* Service Dropdown */}
      <select
        value={selectedService}
        onChange={(e) => setSelectedService(e.target.value)}
      >
        <option value="">Select a Service</option>
        {services.map((service) => (
          <option key={service._id} value={service._id}>
            {service.title}
          </option>
        ))}
      </select>

      {/* Fetch Requests Button */}
      <button onClick={fetchRequests}>Check Status</button>

      {/* Requests Table */}
      {requests.length > 0 ? (
        <table border="1">
          <thead>
            <tr>
              <th>Message</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req._id}>
                <td>{req.message}</td>
                <td>{req.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No requests found.</p>
      )}
    </div>
  );
};

export default UserDashboard;
