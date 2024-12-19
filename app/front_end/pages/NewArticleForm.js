import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function NewArticleForm() {
  const [formData, setFormData] = useState({
    name: "",
    text: "", // Cambiado de 'content' a 'text' para coincidir con el modelo backend
    short_text: "", // Campo opcional para una descripción corta
    attachedFiles: "", // Campo para archivos adjuntos
    author: "",
    googleMaps: "",
    date: "", // Campo para la fecha
    wikiID: "", // Campo requerido en el modelo backend
    versions: [], // Campo para las versiones
  });
  const [images, setImages] = useState([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate required fields
    if (!formData.name || !formData.text || !formData.author || !formData.wikiID) {
      setError("Name, text, author, and Wiki ID are required.");
      return;
    }

    try {
      // Prepare image URLs (this assumes image upload is handled separately)
      const imageUrls = await Promise.all(
        images.map(async (file) => {
          // You would typically use a service like Cloudinary here
          // This is a placeholder - replace with actual image upload logic
          return URL.createObjectURL(file);
        })
      );

      // Prepare the payload to match the backend Article model
      const articlePayload = {
        name: formData.name,
        text: formData.text,
        author: formData.author,
        wikiID: formData.wikiID,
        images: imageUrls,
        short_text: formData.short_text || null,
        attachedFiles: formData.attachedFiles,
        date: formData.date,
        versions: formData.versions,
      };

      const response = await fetch("http://127.0.0.1:13001/api/v1/articles", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(articlePayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Backend error response:", errorData);
        setError(`Failed to create article: ${errorData.message || response.statusText}`);
        throw new Error(errorData.message || response.statusText);
      }

      const responseData = await response.json();
      console.log("Article created successfully:", responseData);
      
      setSuccess(true);
      setFormData({
        name: "",
        text: "",
        author: "",
        googleMaps: "",
        wikiID: "",
        short_text: "",
        attachedFiles: "",
        date: "",
        versions: [],
      });
      setImages([]);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Error creating article:", err);
      setError(err.message || "An unexpected error occurred.");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Create a New Article</h2>
      {success && <div className="alert alert-success">Article created successfully!</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="author">Author</label>
          <input
            type="text"
            className="form-control"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="wikiID">Wiki ID</label>
          <input
            type="text"
            className="form-control"
            id="wikiID"
            name="wikiID"
            value={formData.wikiID}
            onChange={handleChange}
            required
            placeholder="Enter the associated Wiki ID"
          />
        </div>
        <div className="form-group">
          <label htmlFor="text">Text</label>
          <textarea
            className="form-control"
            id="text"
            name="text"
            rows="5"
            value={formData.text}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="short_text">Short Description (Optional)</label>
          <textarea
            className="form-control"
            id="short_text"
            name="short_text"
            rows="2"
            value={formData.short_text}
            onChange={handleChange}
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="attachedFiles">Attached Files</label>
          <input
            type="text"
            className="form-control"
            id="attachedFiles"
            name="attachedFiles"
            value={formData.attachedFiles}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            type="datetime-local"
            className="form-control"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="images">Images</label>
          <input
            type="file"
            className="form-control"
            id="images"
            name="images"
            multiple
            onChange={handleFileChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="googleMaps">Google Maps Location (Optional)</label>
          <input
            type="text"
            className="form-control"
            id="googleMaps"
            name="googleMaps"
            value={formData.googleMaps}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">Create Article</button>
      </form>
    </div>
  );
}
