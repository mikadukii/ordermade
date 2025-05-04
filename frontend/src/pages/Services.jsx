import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ServiceCard from './ServiceCard';  // Updated from PortfolioCard to ServiceCard
import AddEditService from './AddEditServices';  // Updated from AddEditPortfolio to AddEditService
import Modal from 'react-modal';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MdAdd } from 'react-icons/md';

const Services = () => {
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState(null);
  const [serviceItems, setServiceItems] = useState([]);
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const getUserInfo = async () => {
    try {
      const response = await axios.get("http://localhost:3000/get-user-profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data?.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      console.error("Fetch failed:", error);
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  const getServices = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }
      
      const response = await axios.get("http://localhost:3000/get-services", {
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token as a header
        },
      });

      console.log("Services Response:", response); // Log the response to verify the structure

      if (response.data?.Services) {
        setServiceItems(response.data.Services);
      }
    } catch (error) {
      console.error("Unexpected Error Occurred:", error);
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  const handleEditService = (item) => {
    setOpenAddEditModal({ isShown: true, type: "edit", data: item });
  };

  const handleViewService = (item) => {
    console.log("View service item", item);
  };

  useEffect(() => {
    getServices();
    getUserInfo();
  }, []);

  return (
    <>
      <Navbar userInfo={userInfo} />

      <div className="container mx-auto py-10">
        <div className="flex gap-7">
          <div className="flex-1">
            {serviceItems.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {serviceItems.map((item) => (
                  <ServiceCard  // Updated from PortfolioCard to ServiceCard
                    key={item._id}
                    imgURL={item.imageURL}
                    title={item.title}
                    description={item.description}
                    onEdit={() => handleEditService(item)}  // Updated to handle services
                    onClick={() => handleViewService(item)}  // Updated to handle services
                  />
                ))}
              </div>
            ) : (
              <p>No services added yet. Start adding one!</p>  // Updated message
            )}
          </div>

          {/* Optional sidebar */}
          <div className="w-[320px]"></div>
        </div>
      </div>

      {/* Modal for Add/Edit Service */}
      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() =>
          setOpenAddEditModal({ isShown: false, type: "add", data: null })
        }
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
            zIndex: 999,
          },
        }}
        ariaHideApp={false}
        className="model-box"
      >
        <AddEditService  // Updated to AddEditService
          type={openAddEditModal.type}
          serviceInfo={openAddEditModal.data}  // Updated to serviceInfo
          onClose={() =>
            setOpenAddEditModal({ isShown: false, type: "add", data: null })
          }
          getServices={getServices}  // Updated to getServices
        />
      </Modal>

      {/* Floating Add Button */}
      <button
        className="w-16 h-16 flex items-center justify-center rounded-full bg-green-600 text-white hover:bg-green-700 fixed right-10 bottom-10 shadow-lg"
        onClick={() =>
          setOpenAddEditModal({ isShown: true, type: "add", data: null })
        }
      >
        <MdAdd size={28} />
      </button>

      <ToastContainer />
    </>
  );
};

export default Services;
