import React from 'react';
import { useNavigate } from 'react-router-dom';
import ServiceCard from '../pages/ServiceCard';
import sampleImg from '../assets/sample-dress.png';

const ExploreServices = () => {
  const navigate = useNavigate();

  const services = [
    {
      id: "1",
      title: "Lolita Inspired Ballerina dress",
      description: "Past commission my client wanted to make cute dress",
      imgURL: sampleImg,
    },
    {
      id: "2",
      title: "Elegant Corset Gown",
      description: "Custom piece designed for a bridal photoshoot",
      imgURL: sampleImg,
    },
    {
      id: "3",
      title: "Modern Kimono Dress",
      description: "Fusion of traditional and modern aesthetics",
      imgURL: sampleImg,
    },
  ];

  const handleCardClick = (id) => {
    navigate(`/order-services/${id}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-semibold mb-2 text-slate-800">Explore Services</h1>
      <p className="text-slate-600 mb-8">Discover a variety of services tailored to your needs.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            title={service.title}
            description={service.description}
            imgURL={service.imgURL}
            onClick={() => handleCardClick(service.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default ExploreServices;
