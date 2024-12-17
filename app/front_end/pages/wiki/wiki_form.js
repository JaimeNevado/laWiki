import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function NewArticleForm() {
  const [formData, setFormData] = useState({
    name: "",
    text: "",
    author: "",
    googleMaps: "",
    date: new Date().toISOString(), // Fecha actual en formato ISO
  });
  const [images, setImages] = useState([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files); // Convertir archivos a un array
    setImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Reiniciar el estado de error

    // Validar campos obligatorios
    if (!formData.name || !formData.text || !formData.author) {
      setError("All fields (name, text, author) are required.");
      return;
    }

    // Verificar los datos antes de enviarlos
    console.log("Data being sent:", formData);
    console.log("Images being sent:", images);

    try {
      const formDataToSend = new FormData();
      // Añadir campos de texto
      formDataToSend.append("name", formData.name);
      formDataToSend.append("text", formData.text);
      formDataToSend.append("author", formData.author);
      formDataToSend.append("googleMaps", formData.googleMaps);
      formDataToSend.append("date", formData.date); // Fecha en formato ISO

      // Añadir archivos de imagen
      images.forEach((image) => {
        formDataToSend.append("images", image);
      });

      const response = await fetch("http://127.0.0.1:13001/api/v1/articles", {
        method: "POST",
        body: formDataToSend, // Usamos FormData para enviar archivos
      });

      if (!response.ok) {
        // Obtener más detalles del error desde la respuesta del servidor
        const errorData = await response.json();
        console.error("Backend error response:", errorData);

        // Mostrar el mensaje completo de error y la respuesta del servidor
        setError(`Failed to create article: ${errorData.message || response.statusText}`);
        throw new Error(errorData.message || response.statusText);
      }

      console.log("Article created successfully:", formData);
      setSuccess(true);
      setFormData({
        name: "",
        text: "",
        author: "",
        googleMaps: "",
        date: new Date().toISOString(),
      }); // Reiniciar el formulario
      setImages([]); // Limpiar imágenes
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
          <label htmlFor="text" className="form-label">Text</label>
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
          <label htmlFor="googleMaps" className="form-label">Google Maps Location</label>
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
