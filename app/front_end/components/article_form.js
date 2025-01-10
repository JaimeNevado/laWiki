import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import "bootstrap/dist/css/bootstrap.min.css";
import { refreshNotifications } from "./notifications/notifications_bell";

export default function ArticleForm({ requestType, articleId }) {
  const router = useRouter();
  const { wikiID } = router.query;
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userFromLocalStorage = JSON.parse(localStorage.getItem("user"));
    setUser(userFromLocalStorage || null); // Permite que el usuario sea null
    const userEmail = localStorage.getItem("email");

    if (userEmail) {
      refreshNotifications(userEmail);
    }
    if(!userEmail){
      router.push("/login");
    }
  }, []);

  
  const [formData, setFormData] = useState({
    name: "",
    text: "",
    short_text: "",
    attachedFiles: "",
    author: user?.name || "",
    googleMaps: "",
    date: new Date().toISOString(),
    wikiID: wikiID || "",
    images: [],
    versions: [],
  });
  
  useEffect(() => {setFormData({
    name: "",
    text: "",
    short_text: "",
    attachedFiles: "",
    author: user?.name || "",
    googleMaps: "",
    date: new Date().toISOString(),
    wikiID: wikiID || "",
    images: [],
    versions: [],
  })}, [user, wikiID]);
  
  const [images, setImages] = useState([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

 
  useEffect(() => {
    if (requestType === "PUT" && articleId) {
      const fetchArticle = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_ARTICLES_API_URL}/api/v1/articles/${articleId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
          if (!response.ok) {
            throw new Error(`Error fetching article: ${response.status}`);
          }
          const data = await response.json();
          setFormData({
            name: data.name || "",
            text: data.text || "",
            short_text: data.short_text || "",
            attachedFiles: data.attachedFiles || "",
            author: data.author || "",
            googleMaps: data.googleMaps || "",
            date: new Date().toISOString(),
            wikiID: data.wikiID || "",
            images: data.images || [],
            versions: data.versions || [],
          });
        } catch (error) {
          console.error("Error fetching article:", error.message);
          setError(error.message);
        }
      };
      fetchArticle();
    }
  }, [requestType, articleId]);

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

    let imageUrls = formData.images;

    if (images.length > 0) {
      // Crear un FormData para las imágenes
      const imagesFormData = new FormData();
      images.forEach((image, index) => {
        imagesFormData.append(`files`, image);
      });

      try {
        // Subir las imágenes y obtener las URLs
        const uploadResponse = await fetch(`${process.env.NEXT_PUBLIC_ARTICLES_API_URL}/api/v1/upload_images`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
          body: imagesFormData,
        });
        if (!uploadResponse.ok) {
          throw new Error(`Failed to upload images: ${uploadResponse.statusText}`);
        }

        const uploadResult = await uploadResponse.json();
        imageUrls = [...imageUrls, ...uploadResult.urls];
      } catch (error) {
        console.error("Error uploading images:", error);
        setError(error.message);
        return;
      }
    }

    // Crear los datos del artículo con las URLs de las imágenes
    const articleData = {
      ...formData,
      images: imageUrls,
      versions: [
        ...formData.versions,
        {
          version: formData.versions.length + 1,
          short_text: formData.short_text,
          text: formData.text,
          date: new Date().toISOString(),
        },
      ],
    };

    console.log("Article data to send:", articleData);
    try {
      // Enviar los datos del artículo al servidor
      const articleResponse = await fetch(`${process.env.NEXT_PUBLIC_ARTICLES_API_URL}/api/v1/articles${requestType === "PUT" ? `/${articleId}` : ""}`, {
        method: requestType,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(articleData),
      });

      if (!articleResponse.ok) {
        throw new Error(`Failed to submit article: ${articleResponse.statusText}`);
      }

      const articleResult = await articleResponse.json();
      setSuccess(true);

      if (!user?.email) {
        throw new Error("User email is not available");
      }

      const notification = {
        date: new Date().toISOString(),
        title: requestType === "POST" ? "New Article Created" : "Article Updated",
        body: `The article "${articleData.name}" has been ${requestType === "POST" ? "created" : "updated"}.`,
        opened: false,
        user_id: user.email,
      };

      console.log("Notification payload:", notification); // Add logging to verify the notification payload


      const notificationResponse = await fetch(`${process.env.NEXT_PUBLIC_NOTIFICATIONS_API_URL}/api/v1/notifications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(notification),
      });

      if (!notificationResponse.ok) {
        throw new Error(`Failed to send notification: ${notificationResponse.statusText}`);
      }

      router.push(`/article_page?id=${articleId? articleId: articleResult.inserted_id}`);
    } catch (error) {
      console.error("Error submitting article:", error);
      setError(error.message);
    }
  };

  return (
    <div className="container mt-5">
      <h2>{requestType === "POST" ? "Create a New Article" : "Edit Article"}</h2>
      {success && <div className="alert alert-success">Article {requestType === "POST" ? "created" : "updated"} successfully!</div>}
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
            readOnly
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
        {/* <div className="form-group">
          <label htmlFor="attachedFiles">Attached Files</label>
          <input
            type="text"
            className="form-control"
            id="attachedFiles"
            name="attachedFiles"
            value={formData.attachedFiles}
            onChange={handleChange}
          />
        </div> */}
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
    </div>
  );
}