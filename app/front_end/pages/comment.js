import { useEffect, useState, useMemo } from "react"; // Asegúrate de que useState está importado
import { useRouter } from "next/router";
import styles from "../css/Comments.module.css"; // Archivo CSS

// Componente para mostrar los comentarios
export default function Comments() {
  const [comments, setComments] = useState([]); // Estado para almacenar los comentarios
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null); // Estado de error

  useEffect(() => {
    // Cargar todos los comentarios desde el backend
    fetch("http://127.0.0.1:13002/api/v1/comments")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error fetching comments: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setComments(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching comments:", error);
        setError(error.message);
        setLoading(false);
      });
  }, []); // Ejecutar solo al montar el componente

  if (loading) {
    return <p className={styles.loading}>Loading comments...</p>;
  }

  if (error) {
    return <p className={styles.error}>Error loading comments: {error}</p>;
  }

  return (
    <div className={styles.commentsContainer}>
      <h2 className={styles.title}>Comments</h2>
      {comments.length > 0 ? (
        comments.map((comment) => (
          <div key={comment._id} className={styles.commentCard}>
            <h3 className={styles.commentTitle}>{comment.title}</h3>
            <p className={styles.commentAuthor}>
              <strong>Author:</strong> {comment.author_id || "Unknown"}
            </p>
            <p className={styles.commentDate}>
              <strong>Date:</strong>{" "}
              {comment.date ? new Date(comment.date).toLocaleString() : "No date"}
            </p>
            <p className={styles.commentBody}>
              {comment.body || "No content for this comment."}
            </p>
          </div>
        ))
      ) : (
        <p className={styles.noComments}>No comments available.</p>
      )}
    </div>
  );
}

  