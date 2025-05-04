import React, { useState, useEffect } from 'react';
import { Search, Heart, BookOpen, FolderOpen } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ServicesSelect = () => {
    const [services, setServices] = useState([]);
    const [selectedServices, setSelectedServices] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/services');
            setServices(response.data);
        } catch (error) {
            console.error('Error fetching services:', error);
        }
    };

    const toggleServiceSelection = (service) => {
        setSelectedServices(prev => {
            const isSelected = prev.find(s => s._id === service._id);
            if (isSelected) {
                return prev.filter(s => s._id !== service._id);
            } else {
                return [...prev, service];
            }
        });
    };

    const handleProceed = () => {
        if (selectedServices.length === 0) {
            alert('Please select at least one service to proceed');
            return;
        }
        navigate('/request-form', { 
            state: { 
                selectedServices,
                totalAmount: selectedServices.reduce((sum, service) => sum + service.price, 0)
            } 
        });
    };

    const filteredServices = services.filter(service =>
        service.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search services..."
                        className="w-full pl-10 pr-4 py-2 border rounded-lg"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredServices.map((service) => (
                    <div
                        key={service._id}
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${
                            selectedServices.find(s => s._id === service._id)
                                ? 'border-blue-500 bg-blue-50'
                                : 'hover:shadow-lg'
                        }`}
                        onClick={() => toggleServiceSelection(service)}
                    >
                        <img
                            src={service.imageUrl || 'default-service-image.jpg'}
                            alt={service.name}
                            className="w-full h-48 object-cover rounded-lg mb-4"
                        />
                        <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
                        <p className="text-gray-600 mb-2">{service.description}</p>
                        <p className="text-blue-600 font-bold">${service.price}</p>
                    </div>
                ))}
            </div>

            {selectedServices.length > 0 && (
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
                    <div className="max-w-7xl mx-auto flex justify-between items-center">
                        <div>
                            <p className="font-semibold">Selected Services: {selectedServices.length}</p>
                            <p className="text-blue-600 font-bold">
                                Total: ${selectedServices.reduce((sum, service) => sum + service.price, 0)}
                            </p>
                        </div>
                        <button
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                            onClick={handleProceed}
                        >
                            Proceed to Request Form
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ServicesSelect;