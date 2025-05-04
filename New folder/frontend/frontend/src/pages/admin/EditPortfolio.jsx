import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditPortfolio = () => {
    const { id } = useParams(); // Get portfolio ID from URL
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
    });

    useEffect(() => {
        // Fetch existing portfolio data if editing
        const fetchPortfolio = async () => {
            try {
                const response = await axios.get(`/api/portfolio/${id}`);
                setFormData({
                    title: response.data.title,
                    description: response.data.description,
                });
            } catch (error) {
                console.error('Error fetching portfolio:', error);
            }
        };

        if (id) fetchPortfolio();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (id) {
                // Update existing portfolio
                await axios.put(`/api/portfolio/${id}`, formData);
            } else {
                // Create new portfolio
                await axios.post('/api/portfolio', formData);
            }
            navigate('/admin/portfolio'); // Redirect after success
        } catch (error) {
            console.error('Error saving portfolio:', error);
        }
    };

    return (
        <div>
            <h1>{id ? 'Edit Portfolio' : 'Add Portfolio'}</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">{id ? 'Update' : 'Create'}</button>
            </form>
        </div>
    );
};

export default EditPortfolio;
