import React, { useState, useEffect } from 'react';
import { MdAdd, MdDeleteOutline, MdUpdate, MdClose } from "react-icons/md";
import axios from 'axios';
import { toast } from 'react-toastify';
import uploadImage from '../utils/uploadImage';  // Adjust this path if needed
import ImageSelector from './ImagesSelector';   // Adjust this path if needed

const AddEditPortfolio = ({
  portfolioInfo,
  type,
  onClose,
  getPortfolio,
}) => {
  const [title, setTitle] = useState(portfolioInfo?.title || "");
  const [portfolioImg, setPortfolioImg] = useState(portfolioInfo?.imageUrl || "");
  const [description, setDescription] = useState(portfolioInfo?.description || "");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");  // Get token from localStorage

  // Add new portfolio
  const addNewPortfolio = async () => {
    try {
      let imageURL = "";  // Changed from imageUrl to imageURL
  
      if (portfolioImg && typeof portfolioImg === "object") {
        const imgUploadRes = await uploadImage(portfolioImg);
        imageURL = imgUploadRes.imageUrl || "";  // Assuming the backend sends imageUrl as the response key
      }
  
      const response = await axios.post("http://localhost:3000/add-portfolio", {
        title,
        imageURL: imageURL || "",  // Ensure this matches the key expected by the backend
        description,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (response.data && response.data.message) {
        toast.success("Portfolio added successfully");
        getPortfolio();
        onClose();
      }
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || "Unexpected error occurred");
    }
  };
  
  // Update function also needs to send imageURL
  const updatePortfolio = async () => {
    const portfolioId = portfolioInfo._id;
    try {
      let imageURL = portfolioImg;  // Use imageURL instead of imageUrl
      let postData = { title, imageURL, description };
  
      if (typeof portfolioImg === "object") {
        const imgUploadRes = await uploadImage(portfolioImg);
        imageURL = imgUploadRes.imageUrl || "";  // Use imageURL instead of imageUrl
        postData.imageURL = imageURL;  // Use imageURL instead of imageUrl
      }
  
      const response = await axios.put(`http://localhost:3000/edit-portfolio/${portfolioId}`, postData, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (response.data && response.data.message) {
        toast.success("Portfolio updated successfully");
        getPortfolio();
        onClose();
      }
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || "Unexpected error occurred");
    }
  };
  

  // Handle add or update button click
  const handleAddOrUpdateClick = () => {
    if (!title) {
      setError("Please enter a title");
      return;
    }
    if (!description) {
      setError("Please enter a description");
      return;
    }

    setError("");

    if (type === "edit") {
      updatePortfolio();
    } else {
      addNewPortfolio();
    }
  };

  // Delete portfolio image
  const handleDeletePortfolioImg = async () => {
    if (!token) {
      setError("You must be logged in.");
      return;
    }

    try {
      const deleteImgRes = await axios.delete("http://localhost:3000/delete-image", {
        data: { imageUrl: portfolioInfo.imageUrl },  // Ensure this key matches backend
        headers: { Authorization: `Bearer ${token}` },
      });

      if (deleteImgRes.data) {
        const postData = {
          title,
          description,
          imageUrl: "",
        };
        await axios.put(`http://localhost:3000/edit-portfolio/${portfolioInfo._id}`, postData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPortfolioImg(null);
      }
    } catch (error) {
      console.error("Failed to delete image", error);
    }
  };

  // Delete portfolio
  const deletePortfolio = async () => {
    if (!token) {
      setError("You must be logged in.");
      return;
    }

    try {
      const headers = {
        Authorization: `Bearer ${token}`,  // Add token in Authorization header
      };

      const response = await axios.delete(
        `http://localhost:3000/delete-portfolio/${portfolioInfo._id}`,
        { headers }
      );
      if (response.data && !response.data.error) {
        toast.success("Portfolio deleted successfully");
        getPortfolio();
        onClose();
      }
    } catch (error) {
      console.error("Failed to delete portfolio", error);
      toast.error("Unexpected error occurred");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h5 className="text-2xl font-medium text-slate-700">
          {type === "add" ? "Add Portfolio" : "Update Portfolio"}
        </h5>

        <div className="flex items-center gap-3 bg-green-50/50 p-2 rounded-lg">
          {type === "add" ? (
            <button className="btn-small" onClick={handleAddOrUpdateClick}>
              <MdAdd className="text-lg" /> ADD PORTFOLIO
            </button>
          ) : (
            <>
              <button className="btn-small" onClick={handleAddOrUpdateClick}>
                <MdUpdate className="text-lg" /> UPDATE
              </button>
              <button className="btn-small btn-delete" onClick={deletePortfolio}>
                <MdDeleteOutline className="text-lg" /> DELETE
              </button>
            </>
          )}
          <button onClick={onClose}>
            <MdClose className="text-xl text-slate-400" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-2 pt-4">
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <label className="input-label text-xl font-semibold">Portfolio Title</label>
        <input
          type="text"
          className="text-l text-slate-950 outline-none"
          placeholder="Portfolio Title"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />

        <ImageSelector
          image={portfolioImg}
          setImage={setPortfolioImg}
          handleDeleteImg={handleDeletePortfolioImg}
        />

        <div className="flex flex-col gap-2 mt-4">
          <label className="input-label text-xl font-semibold">Portfolio Description</label>
          <textarea
            className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
            placeholder="Enter Description"
            rows={10}
            value={description}
            onChange={({ target }) => setDescription(target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default AddEditPortfolio;
