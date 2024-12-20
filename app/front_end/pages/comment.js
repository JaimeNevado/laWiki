import { useEffect, useState } from "react";
import styles from "../css/Comments.module.css"; // Archivo CSS

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
    return <p className={styles.loading}>Cargando comentarios...</p>;
  }

  if (error) {
    return <p className={styles.error}>Error al cargar comentarios: {error}</p>;
  }

  return (
    <div className={styles.commentsContainer}>
      <h2 className={styles.title}>Comments</h2>
      {comments.length > 0 ? (
        comments.map((comment) => (
          <div key={comment._id} className={styles.commentCard}>
            <h3 className={styles.commentTitle}>{comment.title}</h3>
            <p className={styles.commentAuthor}>
              <strong>Autor:</strong> {comment.author_id || "Desconocido"}
            </p>
            <p className={styles.commentDate}>
              <strong>Fecha:</strong>{" "}
              {comment.date ? new Date(comment.date).toLocaleString() : "Sin fecha"}
            </p>
            <p className={styles.commentBody}>
              {comment.body || "No hay contenido para este comentario."}
            </p>
          </div>
        ))
      ) : (
        <p className={styles.noComments}>No hay comentarios disponibles.</p>
      )}
    </div>
  );
}
