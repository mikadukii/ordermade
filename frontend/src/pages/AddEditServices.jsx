import React, { useState, useEffect } from 'react';
import { MdAdd, MdDeleteOutline, MdUpdate, MdClose } from "react-icons/md"; 
import axios from 'axios';
import { toast } from 'react-toastify';
import uploadImage from '../utils/uploadImage'; 
import ImageSelector from './ImagesSelector';     

const AddEditServices = ({
  servicesInfo,
  type,
  onClose,
  getServices,
}) => {
  const [title, setTitle] = useState(servicesInfo?.title || "");
  const [servicesImg, setServicesImg] = useState(servicesInfo?.imageURL || "");
  const [description, setDescription] = useState(servicesInfo?.description || "");
  const [price, setPrice] = useState(servicesInfo?.price || "");
  const [category, setCategory] = useState(servicesInfo?.category || "");
  const [error, setError] = useState("");

  const token = localStorage.getItem('token'); // Get token from localStorage

  const categories = ["formal dress", "cosplay", "wedding"];

  const addNewServices = async () => {
    try {
      let imageURL = "";
  
      // Check if there is an image and upload it
      if (servicesImg && typeof servicesImg === "object") {
        const imgUploadRes = await uploadImage(servicesImg);
        imageURL = imgUploadRes.imageURL || "";
      } else {
        // Use the existing image URL or empty string if not provided
        imageURL = servicesImg || "";
      }
  
      // Log the data being sent for debugging
      console.log({
        title,
        price,
        category,
        description,
        imageURL
      });
  
      // Get the token from localStorage or wherever it's stored
      const token = localStorage.getItem("token");  // Adjust this if needed
  
      if (!token) {
        toast.error("You need to log in first");
        return;
      }
  
      // Sending request with authorization header
      const response = await axios.post(
        "http://localhost:3000/add-services", 
        {
          title,
          price,
          category,
          description,
          imageURL,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      // Handle successful response
      if (response.data && !response.data.error) {
        toast.success("Service added successfully");
        getServices();  // Refresh the services list
        onClose();      // Close the modal or form
      }
    } catch (error) {
      console.error("Error occurred while adding services:", error);
  
      if (error.response) {
        console.log("Error response data:", error.response.data);
        toast.error(`Failed to add service: ${error.response.data.message || error.message}`);
      } else {
        toast.error("Failed to add service");
      }
    }
  };
  
  

  const updateServices = async () => {
    const serviceId = servicesInfo._id;
    try {
      let imageURL = servicesImg;
      let postData = { title, price, category, imageURL, description };

      if (typeof servicesImg === "object") {
        const imgUploadRes = await uploadImage(servicesImg);
        imageURL = imgUploadRes.imageURL || "";
        postData.imageURL = imageURL;
      }

      const response = await axios.put(`http://localhost:3000/edit-services/${serviceId}`, postData);

      if (response.data && response.data.services) {
        toast.success("Services updated successfully");
        getServices();
        onClose();
      }
    } catch (error) {
      console.error("Update Services Error:", error);
      setError(error.response?.data?.message || "Unexpected error occurred");
    }
  };

  const handleAddOrUpdateClick = () => {
    if (!title) {
      setError("Please enter a title");
      return;
    }
    if (!description) {
      setError("Please enter a description");
      return;
    }
    if (!price || isNaN(price)) {
      setError("Please enter a valid price");
      return;
    }
    if (!category) {
      setError("Please select a category");
      return;
    }

    setError("");

    if (type === "edit") {
      updateServices();
    } else {
      addNewServices();
    }
  };

  const handleDeleteServicesImg = async () => {
    if (!servicesImg) return;

    try {
      const deleteImgRes = await axios.delete("http://localhost:3000/delete-image", {
        params: { imageURL: servicesImg },
      });

      if (deleteImgRes.data) {
        const postData = {
          title,
          description,
          price,
          category,
          imageURL: "",
        };
        await axios.put(`http://localhost:3000/edit-services/${servicesInfo._id}`, postData);
        setServicesImg(null);
      }
    } catch (error) {
      console.error("Failed to delete image", error);
    }
  };

  const deleteServices = async () => {
    try {
      const response = await axios.put(`http://localhost:3000/delete-services/${servicesInfo._id}`);
      if (response.data && !response.data.error) {
        toast.error("Services deleted successfully");
        getServices();
        onClose();
      }
    } catch (error) {
      console.error("Delete Services Error:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen justify-between p-6">
      {/* Top Section: Header */}
      <div>
        <h5 className="text-3xl font-bold mb-4">
          {type === "add" ? "Add Services" : "Update Services"}
        </h5>
  
        <div className="flex-1 flex flex-col gap-2">
          {error && <p className="text-red-500 text-sm">{error}</p>}
  
          <label className="input-label text-xl font-semibold">Title</label>
          <input
            type="text"
            className="text-l text-slate-950 outline-none"
            placeholder="Enter Services Title"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
  
          <label className="input-label text-xl font-semibold">Price</label>
          <input
            type="number"
            className="text-l text-slate-950 outline-none"
            placeholder="Set Fee for the services"
            value={price}
            onChange={({ target }) => setPrice(target.value)}
          />
  
          <label className="input-label text-xl font-semibold">Set Category</label>
          <select
            className="text-l text-slate-950 outline-none"
            value={category}
            onChange={({ target }) => setCategory(target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
  
          <ImageSelector
            image={servicesImg}
            setImage={setServicesImg}
            handleDeleteImg={handleDeleteServicesImg}
          />
  
          <label className="input-label text-xl font-semibold mt-4">Services Description</label>
          <textarea
            className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
            placeholder="Enter Description"
            rows={10}
            value={description}
            onChange={({ target }) => setDescription(target.value)}
          />
        </div>
      </div>
  
      {/* Bottom Section: Buttons */}
      <div className="flex justify-center mt-6">
        {type === "add" ? (
          <button className="bg-emerald-600 font-semibold text-white px-6 py-2 rounded-md hover:bg-green-700 transition" onClick={handleAddOrUpdateClick}>
            Add Service
          </button>
        ) : (
          <div className="flex gap-3">
            <button className="btn-small" onClick={handleAddOrUpdateClick}>
              <MdUpdate className="text-lg" /> UPDATE
            </button>
            <button className="btn-small btn-delete" onClick={deleteServices}>
              <MdDeleteOutline className="text-lg" /> DELETE
            </button>
          </div>
        )}
      </div>

    </div>
  );
  
};

export default AddEditServices;
