import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { refreshNotifications } from '../components/notifications/notifications_bell';
import Article from "../components/article";
import ArticleVersion from "../components/articles/version";
import styles from "../css/ArticlePage.module.css";
import fetchData from "../components/utils/fetchData";
import Link from "next/link";
import { use } from "react";

export default function ArticlesListPage() {
  const router = useRouter();
  const { id } = router.query;
  const [article, setArticle] = useState(null);
  const [wikiName, setWikiName] = useState("");
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [selectedRating, setSelectedRating] = useState(null);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null); // Estado para las notificaciones
  const [user, setStoredUser] = useState(null);
  const [canEdit, setCanEdit] = useState(false);
  const [language, setLanguage] = useState("en");


  useEffect(() => {
    setStoredUser(JSON.parse(localStorage.getItem("user")));
    if (user?.name) {
      setNewComment((prev) => ({
        ...prev,
        author: user.name,
        email: user.email,
      }));
    }
  }, []);

  useEffect(() => {
    let userEmail = localStorage.getItem("email");
    if (userEmail) {
      refreshNotifications(userEmail);
    }
    if (id) {
      fetchData(`${process.env.NEXT_PUBLIC_ARTICLES_API_URL}/api/v1/articles/${id}`, (data) => {
        setArticle(data);
        if (data.wikiID) {
          fetchData(`${process.env.NEXT_PUBLIC_WIKI_API_URL}/api/v1/wikis/${data.wikiID}`, (wikiData) => {
            setWikiName(wikiData.name || "Wiki Not Found");
          }, setError);
        }
      }, setError);

      fetchData(`${process.env.NEXT_PUBLIC_ARTICLES_API_URL}/api/v1/articles/${id}/comments/`, (data) => {
        setComments(Array.isArray(data) ? data : []);
      }, setError);
    };
  }, [id]);

  useEffect(() => {
    setCanEdit(user && article && user.name === article.author);
    console.log("author: ", article?.author, "user: ", user?.name);
  }, [user, article]);


  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user")); // Obtener datos del usuario del localStorage
    const author = user?.name;  // Si no hay nombre, asigna un nombre por defecto
    const authorEmail = user?.email;  // Si no hay email, asigna un string vacío

    try {
      const commentResponse = await fetch(`${process.env.NEXT_PUBLIC_COMMENTS_API_URL}/api/v1/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          article_id: id,
          author_id: author,  // Usamos el nombre del autor recuperado
          content: newComment,
          rating: selectedRating,
          destination_id: article.email,  // Usamos el email del artículo como destino
        }),
      });

      if (!commentResponse.ok) throw new Error("Failed to add comment");

      const notification = {
        date: new Date().toISOString(), // Formato ISO 8601 para datetime
        title: "New Comment Added",
        body: `A new comment has been added to the article "${article.name}".`,
        opened: false,
        user_id: article.email, // Reemplaza con el ID del usuario receptor
      };

      const notificationResponse = await fetch(`${process.env.NEXT_PUBLIC_NOTIFICATIONS_API_URL}/api/v1/notifications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(notification),
      });

      if (!notificationResponse.ok) throw new Error("Failed to send notification");

      refreshNotifications();

      setComments((prev) => [
        ...prev,
        { content: newComment, author_id: author, date: new Date(), rating: selectedRating },
      ]);
      setNewComment("");
      setSelectedRating(null);
      setNotification({ type: "success", message: "Comment added and notification sent successfully!" });
    } catch (error) {
      setError("Error adding comment or sending notification");
    }
  };


  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this article?")) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_ARTICLES_API_URL}/api/v1/articles/${article._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete article");

      router.push(`/wiki/${article.wikiID}`);
    } catch (err) {
      setError("Error deleting article");
    }
  };

  const handleRestoreVersion = async (version) => {
    try {
      // Llamada al backend para restaurar la versión seleccionada
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_ARTICLES_API_URL}/api/v1/articles/${article._id}/restore`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ version_number: version.version }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to restore version");
      }

      const data = await response.json();
      setArticle((prevArticle) => ({
        ...prevArticle,
        text: version.text,
        short_text: version.short_text,
        images: version.images,
        author: version.author,
        date: version.date,
      }));
      alert(`Version ${version.version} restored successfully!`);
    } catch (err) {
      console.error(err);
      setError("Error restoring version");
    }
  };

  const getMessage = async () => {
    const lugar = article?.googleMaps || "defaultLocation";
    const url = `http://nominatim.openstreetmap.org/search?q=${lugar}&format=json&addressdetails=1`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch location");
      const data = await response.json();
      const mapUrl = `https://www.openstreetmap.org/?mlat=${data[0].lat}&mlon=${data[0].lon}#map=14/${data[0].lat}/${data[0].lon}`;
      window.open(mapUrl, '_blank', 'noopener,noreferrer');
    } catch (err) {
      console.error("Error fetching location:", err);
      setError("Error fetching location");
    }
  };

  const handleLanguageChange = async (e) => {
    const selectedLanguage = e.target.value;
    setLanguage(selectedLanguage);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_ARTICLES_API_URL}/api/v1/translate/?target_language=${selectedLanguage}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: {
            title: article.name,
            content: "Hoy es un día de prueba!!",
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text(); // Lee el cuerpo de la respuesta
        console.error("Error en la respuesta del servidor:", errorText);
        throw new Error(`Error del servidor: ${response.status}`);
      }

      const translatedArticle = await response.json();
      console.log(translatedArticle);  // Para verificar la estructura de la respuesta

      alert(`Artículo traducido: ${translatedArticle.content.title}`);
    } catch (error) {
      console.error("Error translating article:", error);
      alert(`Error traduciendo el artículo: ${error.message}`);
    }
  };


  if (error) return <p className="text-danger text-center">{error}</p>;

  return (

    <div id="main_wrapper" className={`${styles.container} mt-1`}>
      {article ? (
        <>
          <div>
            <label htmlFor="language-selector">Traducir a: </label>
            <select
              id="language-selector"
              value={language}
              onChange={handleLanguageChange}
            >
              <option value="en">Inglés</option>
              <option value="es">Español</option>
              <option value="fr">Francés</option>
            </select>
          </div>
          <h1 className={styles.title}>{wikiName}</h1>
          <div style={{ marginBottom: "40px" }}>
            <h2 className={styles.subtitle}>{article.name}</h2>

            {/* Action Buttons */}
            <div className={styles.actionButtons} style={{
              marginBottom: "2rem",
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}>
              {canEdit && (<>
                <button
                  onClick={() => router.push(`/editArticleForm?article_id=${article._id}`)}
                  className={`${styles.button} ${styles.editButton}`}
                  style={{
                    backgroundColor: "#3498db",
                    color: "#fff",
                    padding: "0.5rem 1rem",
                    border: "none",
                    borderRadius: "5px",
                    marginRight: "1rem"
                  }}
                >
                  Edit Article
                </button>
                <button
                  onClick={handleDelete}
                  className={`${styles.button} ${styles.deleteButton}`}
                  style={{
                    backgroundColor: "#3498db", // Red color for delete
                    color: "#fff",
                    padding: "0.5rem 1rem",
                    border: "none",
                    borderRadius: "5px",

                  }}
                >
                  Delete Article
                </button>
              </>
              )}
            </div>


            <Article article={article} />
            <div>
              <p className="ms-4 ps-2 d-flex align-items-center">
                <i className="fas fa-map-marker-alt me-2 text-primary"></i>
                <span className="fw-bold me-2">Location:</span>
                <Link
                  href="#"
                  onClick={(e) => { e.preventDefault(); getMessage(); }}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-decoration-none hover-underline"
                >
                  {article?.googleMaps || "Maps data not available"}
                  <i className="fas fa-external-link-alt ms-1 small"></i>
                </Link>
              </p>
            </div>
          </div>

          <div style={{ marginBottom: "40px" }}>
            <h3 className={styles.commentsTitle}>Comments</h3>
            <div className={styles.commentsSection}>
              {comments.length > 0 ? (
                comments.map((comment, index) => (
                  <div key={index} className={styles.commentCard} style={{ marginBottom: "20px" }}>
                    <p><strong>{comment.author_id}</strong>: {comment.content}</p>
                    <p>Date: {new Date(comment.date).toLocaleString()}</p>
                    <p>Rating: {"★".repeat(comment.rating)}</p>
                  </div>
                ))
              ) : (
                <p>No comments available.</p>
              )}
            </div>
          </div>

          {user ? (
            <form className={styles.commentForm} onSubmit={handleCommentSubmit} style={{ marginBottom: "40px" }}>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows="4"
                className={styles.commentInput}
                placeholder="Write your comment..."
                style={{ marginBottom: "20px" }}
              />
              <select
                value={selectedRating || ""}
                onChange={(e) => setSelectedRating(Number(e.target.value))}
                className={styles.ratingDropdown}
                style={{ marginBottom: "20px" }}
              >
                <option value="" disabled>Select Rating</option>
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>{num} {"★".repeat(num)}</option>
                ))}
              </select>
              <button type="submit" className={styles.button}>Submit Comment</button>
            </form>) : ""}

          {!!user && (
            <div style={{ marginBottom: "40px" }}>
              <h2>Versions</h2>
              <div className={styles.versionsSection}>
                {article.versions && article.versions.length > 0 ? (
                  article.versions.map((version, index) => (
                    <ArticleVersion
                      key={index}
                      version={version}
                      index={index}
                      onRestoreVersion={handleRestoreVersion} // Pasamos la función de restauración
                    />
                  ))
                ) : (
                  <p>No versions available.</p>
                )}
              </div>
            </div>
          )}
        </>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}