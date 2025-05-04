import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddPortfolio = () => {
    const navigate = useNavigate();
    const [thumbnailPreview, setThumbnailPreview] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        file: null,
        date: new Date().toISOString().split('T')[0], // Current date as timestamp
    });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setFormData({ ...formData, file });
        const reader = new FileReader();
        reader.onloadend = () => {
            setThumbnailPreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        formDataToSend.append("title", formData.title);
        formDataToSend.append("description", formData.description);
        formDataToSend.append("file", formData.file);
        formDataToSend.append("date", formData.date);

        try {
            await axios.post("http://localhost3000/api/portfolio", formDataToSend);
            navigate("/admin/dashboard");
        } catch (error) {
            console.error("Error uploading portfolio:", error);
        }
    };

    return (
        <div>
            <h1>Add Portfolio</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title</label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} required />
                </div>
                <div>
                    <label>Description</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} required />
                </div>
                <div>
                    <label>Image</label>
                    <input type="file" onChange={handleFileChange} required />
                    {thumbnailPreview && <img src={thumbnailPreview} alt="Thumbnail Preview" />}
                </div>
                <button type="submit">Add Portfolio</button>
            </form>
        </div>
    );
};

export default AddPortfolio;
