import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from "next/router";

export default function NewArticleForm() {
  const router = useRouter();
  const { wikiID } = router.query;
  console.log("wikiID:", wikiID);
  const [formData, setFormData] = useState({
    name: "",
    text: "",
    short_text: "",
    attachedFiles: "",
    author: "",
    googleMaps: "",
    date: "2024-11-15T22:27:54",
    wikiID: wikiID || "",
    images: [],
    versions: [],
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

    // Convert image files to URLs if necessary
    const imageUrls = images.map((file) => URL.createObjectURL(file));

    const articleData = {
      ...formData,
      images: imageUrls,
      versions: [
        {
          version: 1,
          short_text: formData.short_text,
          text: formData.text,
          date: formData.date,
        },
      ],
    };

    try {
      const response = await fetch("http://127.0.0.1:13001/api/v1/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(articleData),
      });

      if (!response.ok) {
        throw new Error(`Failed to submit article: ${response.statusText}`);
      }

      const result = await response.json();
      setSuccess(true);
      router.push(`/article_page?id=${result.inserted_id}`);
    } catch (error) {
      console.error("Error submitting article:", error);
      setError(error.message);
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
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
      {success && <p>Article submitted successfully!</p>}
      {error && <p>Error: {error}</p>}
    </div>
  );
}
