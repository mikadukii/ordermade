import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Alert from '../../components/Alert';
import { useNavigate } from 'react-router-dom';
import { 
    Users,
    Image,
} from 'lucide-react';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalServices: 0,
        totalRequests: 0,
        recentUsers: []
    });
    const [message, setMessage] = useState({ type: '', services: '' });
    const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);
    
  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Token being sent:', token);
      if (!token) {
        throw new Error('No authentication token found');
      }

        const response = await axios.get('http://localhost:5000/api/admin/dashboard', {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success) {
            setStats(response.data.data);
        }
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        console.error('Error response:', error.response?.data);

        let errorMessage = 'An error occurred while fetching dashboard data.';

        if (error.response) {
            switch (error.response.status) {
              case 401:
                errorMessage = 'Session expired. Please login again.';
                localStorage.removeItem('token');
                localStorage.removeItem('userRole');
                navigate('/login');
                break;
              case 403:
                errorMessage = 'Access denied. Admin privileges required.';
                navigate('/login');
                break;
              default:
                errorMessage = error.response.data.message || errorMessage;
            }
          }

        setMessage({ type: 'error', services: errorMessage });
        }
    }; 

    const MetricCard = ({ icon, title, value }) => (
        <div className="flex flex-col items-center justify-center p-4 bg-white rounded shadow-md">
            <div className="text-gray-500">{icon}</div>
            <h2 className="text-xl font-bold">{value}</h2>
            <p className="text-gray-700">{title}</p>
        </div>
    );

    const RecentUsersCard = () => (
        <div className="flex flex-col p-4 bg-white rounded shadow-md">
            <h2 className="text-xl font-bold">Recent Users</h2>
            <ul className="mt-2">
                {stats.recentUsers.map((user, index) => (
                    <li key={index} className="flex items-center justify-between p-2 border-b">
                        <span>{user.name}</span>
                        <span>{user.email}</span>
                    </li>
                ))}
            </ul>
        </div>
    );

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
            {message.services && <Alert type={message.type} message={message.services} />}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <MetricCard icon={<Users />} title="Total Users" value={stats.totalUsers} />
                <MetricCard icon={<Image />} title="Total Services" value={stats.totalServices} />
                <MetricCard icon={<Image />} title="Total Requests" value={stats.totalRequests} />
            </div>
            <RecentUsersCard />
        </div>
    );
};

export default AdminDashboard;