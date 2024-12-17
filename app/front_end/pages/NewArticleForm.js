import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function NewArticleForm() {
  const [formData, setFormData] = useState({
    name: "",
    content: "", // Changed from 'text' to 'content' to match backend model
    author: "",
    googleMaps: "",
    wikiID: "", // Added wikiID which is required in the backend model
    short_text: "", // Optional field added for short description
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
    if (!formData.name || !formData.content || !formData.author || !formData.wikiID) {
      setError("Name, content, author, and Wiki ID are required.");
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
        content: formData.content,
        author: formData.author,
        wikiID: formData.wikiID,
        images: imageUrls,
        short_text: formData.short_text || null,
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
        content: "",
        author: "",
        googleMaps: "",
        wikiID: "",
        short_text: "",
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
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
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
        <div className="mb-3">
          <label htmlFor="author" className="form-label">Author</label>
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
        <div className="mb-3">
          <label htmlFor="wikiID" className="form-label">Wiki ID</label>
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
        <div className="mb-3">
          <label htmlFor="content" className="form-label">Content</label>
          <textarea
            className="form-control"
            id="content"
            name="content"
            rows="5"
            value={formData.content}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div className="mb-3">
          <label htmlFor="short_text" className="form-label">Short Description (Optional)</label>
          <textarea
            className="form-control"
            id="short_text"
            name="short_text"
            rows="2"
            value={formData.short_text}
            onChange={handleChange}
          ></textarea>
        </div>
        <div className="mb-3">
          <label htmlFor="images" className="form-label">Images</label>
          <input
            type="file"
            className="form-control"
            id="images"
            name="images"
            multiple
            onChange={handleFileChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="googleMaps" className="form-label">Google Maps Location (Optional)</label>
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
