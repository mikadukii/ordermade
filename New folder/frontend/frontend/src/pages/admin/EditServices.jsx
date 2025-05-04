import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Upload, X, FileText, Image as imageIcon } from "react-feather";
import axios from "axios";


const EditServices = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category: "",
        price: "",
        file: null,
        thumbnail: null,
    });
    const [currentFile, setCurrentFile] = useState(null);
    const [thumbnailPreview, setThumbnailPreview] = useState(null);

    const getCategoryIcon = (category) => {
        switch (category) {
            case "formal dress":
                return <imageIcon className="w-5 h-5 text-green-500" />;
            case "cosplay":
                return <imageIcon className="w-5 h-5 text-blue-500" />;
            case "wedding":
                return <imageIcon className="w-5 h-5 text-purple-500" />;
            default:
                return null;
        }
    };

    useEffect(() => {
        fetchContent();
    } , [id]);

    const fetchContent = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:5000/api/services/${id}`, {
                headers: {Authorization: `Bearer ${token}`}
            });

            if (response.data.success) {
                const { name, description, category, price, file, thumbnail } = response.data;
                setFormData({ name, description, category, price, file, thumbnail });
                setCurrentFile({ url: fileUrl, name: fileName });
                setThumbnailPreview(thumbnailUrl);
                setThumbnailPreview('https://localhost:5000${thumbnailUrl}');
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to fetch content');
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (!file) return;

        if (type === "services") {
            setFormData({ ...formData, file });
            setCurrentFile(URL.createObjectURL(file));
        } else if (type === "thumbnail") {
            setFormData({ ...formData, thumbnail: file });
            setThumbnailPreview(URL.createObjectURL(file));
        }
    };

    const getFileTypeText = () => {
        switch (formData.category) {
            case 'formal dress':
                return 'PNG, JPG, SVG (max 5MB)';
            case 'cosplay':
                return 'PNG, JPG, SVG (max 5MB)';
            case 'wedding':
                return 'PNG, JPG, SVG (max 5MB)';
            default:
                return '';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const formDataToSend = new FormData();
            formDataToSend.append("name", formData.name);
            formDataToSend.append("description", formData.description);
            formDataToSend.append("category", formData.category);
            if (formData.file) {
                formDataToSend.append("file", formData.file);
            }
            if (formData.thumbnail) {
                formDataToSend.append("thumbnail", formData.thumbnail);
            }

            const response = await axios.put(`http://localhost:5000/api/services/${id}`, formDataToSend, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data.success) {
                navigate("/admin/services");
            } else {
                alert(response.data.message || "Failed to update service");
            }
        } catch (error) {
            alert(error.response?.data?.message || "Failed to update service");
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
    );

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Edit Service</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Service Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                            required
                        ></textarea>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Category</label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                            required
                        >
                            <option value="">Select a category</option>
                            <option value="formal dress">Formal Dress</option>
                            <option value="cosplay">Cosplay</option>
                            <option value="wedding">Wedding</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">File ({getFileTypeText()})</label>
                        {currentFile && (
                            <img src={currentFile} alt="Current File" className="w
                            h-32 object-cover mb-2 rounded-md" />
                        )}

                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, "services")}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Thumbnail</label>
                        {thumbnailPreview && (
                            <img src={thumbnailPreview} alt="Thumbnail Preview" className="w-32 h-32 object-cover mb-2 rounded-md" />
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, "thumbnail")}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200"
                    >
                        <upload className="mr-2" /> Update Service
                    </button>
                </form>
                <button
                    onClick={() => navigate("/admin/services")}
                    className="mt-4 w-full py-2 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
                >
                    <X className="mr-2" /> Cancel
                </button>
            </div>
        </div>
    );
}

export default EditServices;
