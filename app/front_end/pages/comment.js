import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "../css/Comments.module.css";

export default function Comments() {
  const [comments, setComments] = useState([]); // Estado para comentarios
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null); // Estado de error
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
  
    if (user && user.name) {
      const encodedAuthor = encodeURIComponent(user.name); // Codificar correctamente
      const url = `${process.env.NEXT_PUBLIC_COMMENTS_API_URL}/api/v1/comments?author=${encodedAuthor}`;
      console.log("Fetching comments from URL:", url); // Verificar URL generada
  
      fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Error fetching comments: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log("Fetched comments data:", data); // Verificar respuesta
          setComments(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching comments:", error);
          setError(error.message);
          setLoading(false);
        });
    } else {
      setLoading(false);
      router.push("/login"); // Redirigir a la página de inicio de sesión
    }
  }, []);
  

  if (loading) {
    return <p className={styles.loading}>Loading comments...</p>;
  }

  if (error) {
    return <p className={styles.error}>{error}</p>;
  }

  return (
    <div className={styles.commentsContainer}>
      {comments.length > 0 ? (
        <>
          <h2 className={styles.title}>Your Comments</h2>
          {comments.map((comment) => (
            <div key={comment._id} className={styles.commentCard}>
              <h3 className={styles.commentTitle}>{comment.title}</h3>
              <p className={styles.commentDate}>
                <strong>Date:</strong>{" "}
                {comment.date ? new Date(comment.date).toLocaleString() : "No date"}
              </p>
              <p className={styles.commentBody}>
                {comment.content || "No content for this comment."}
              </p>
            </div>
          ))}
        </>
      ) : (
        <p className={styles.noComments}>You didn't publish any comment yet.</p>
      )}
    </div>
  );
}
