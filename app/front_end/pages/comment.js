import { useEffect, useState } from "react";

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
        return <p>Cargando comentarios...</p>;
    }

    if (error) {
        return <p>Error al cargar comentarios: {error}</p>;
    }

    return (
        <div>
            <h2>Comentarios</h2>
            {comments.length > 0 ? (
                comments.map((comment) => (
                    <div key={comment._id} style={{ marginBottom: "20px" }}>
                        <h3>{comment.title}</h3>
                        <p>
                            <strong>Autor:</strong> {comment.author_id || "Desconocido"}
                        </p>
                        <p>
                            <strong>Fecha:</strong>{" "}
                            {comment.date ? new Date(comment.date).toLocaleString() : "Sin fecha"}
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
