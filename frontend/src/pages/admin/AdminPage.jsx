import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminPage = () => {
  const [requests, setRequests] = useState([]);

  // Fetch all requests
  useEffect(() => {
    axios.get("http://localhost:5000/api/requests")
      .then((res) => setRequests(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Function to update request status
  const updateStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/requests/${id}/status`, { status });
      setRequests((prevRequests) =>
        prevRequests.map((req) =>
          req._id === id ? { ...req, status } : req
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Request List</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Message</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req._id}>
              <td>{req.name}</td>
              <td>{req.email}</td>
              <td>{req.message}</td>
              <td>{req.status}</td>
              <td>
                {req.status === "pending" && (
                  <>
                    <button onClick={() => updateStatus(req._id, "approved")}>Approve</button>
                    <button onClick={() => updateStatus(req._id, "rejected")}>Reject</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPage;
