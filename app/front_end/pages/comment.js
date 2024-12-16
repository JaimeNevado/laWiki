import { useEffect, useState } from "react";

export default function Comments() {
    const [comments, setComments] = useState([]); // Estado para almacenar los comentarios
    const [loading, setLoading] = useState(true); // Estado de carga
    const [error, setError] = useState(null); // Estado de error

    useEffect(() => {
        // Cargar todos los comentarios desde el backend
        fetch("http://127.0.0.1:13001/api/v1/comments")
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                setComments(data); // Guardar los comentarios obtenidos
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching comments:", err);
                setError("No se pudieron cargar los comentarios.");
                setLoading(false);
            });
    }, []); // Este hook se ejecuta solo una vez cuando se monta el componente

    if (loading) {
        return <div>Loading comments...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h2>Comentarios</h2>
            {comments.length > 0 ? (
                comments.map((comment) => (
                    <div key={comment._id} style={{ marginBottom: "20px" }}>
                        <h3>{comment.title}</h3>
                        <p>
                            <strong>Author:</strong> {comment.author_id}
                        </p>
                        <p>
                            <strong>Date:</strong> {new Date(comment.date).toLocaleString()}
                        </p>
                        <p>{comment.body || "No hay contenido para este comentario."}</p>
                    </div>
                ))
            ) : (
                <p>No hay comentarios disponibles.</p>
            )}
        </div>
    );
}
