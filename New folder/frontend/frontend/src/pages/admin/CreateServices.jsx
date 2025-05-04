

const CreateServices = () => {
    const navigate = useNavigate();
    const [thumbnailPreview, setThumbnailPreview] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category: "",
        price: "",
        file: null,
        thumbnail: null,
    });

    const handleFileChange = (e, type) => {
        if (type === "services") {
            setFormData({ ...formData, file });
            const reader = new FileReader();
            reader.onloadend = () => {
                setThumbnailPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        formDataToSend.append("name", formData.name);
        formDataToSend.append("description", formData.description);
        formDataToSend.append("category", formData.category);
        formDataToSend.append("file", formData.file);

        try {
            await axios.post("http://localhost:5000/api/services", formDataToSend);
            navigate("/admin/dashboard");
        } catch (error) {
            console.error("Error creating service:", error);
        }
    };

    return (
        <div>
            <h1>Create Service</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div>
                    <label>Description</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} required />
                </div>
                <div>
                    <label>Category</label>
                    <input type="text" name="category" value={formData.category} onChange={handleChange} required />
                </div>
                <div>
                    <label>File</label>
                    <input type="file" onChange={(e) => handleFileChange(e, "services")} required />
                    {thumbnailPreview && <img src={thumbnailPreview} alt="Thumbnail Preview" />}
                </div>
                <button type="submit">Create Service</button>
            </form>
        </div>
    );
};

export default CreateServices;


