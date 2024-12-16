import { useState, useEffect } from "react";

export default function AllComments() {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch all comments
    useEffect(() => {
        fetch("http://127.0.0.1:13002/api/v1/comments")
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Error fetching comments: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                setComments(data);
            })
            .catch((error) => console.error("Error fetching comments:", error))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="all-comments">
            <h3>All Comments</h3>
            {loading ? (
                <p>Loading comments...</p>
            ) : comments.length > 0 ? (
                comments.map((comment) => (
                    <div key={comment._id} className="comment">
                        <h4>{comment.title}</h4>
                        <p>{comment.body}</p>
                        <small>
                            By: {comment.author_id} on {new Date(comment.date).toLocaleString()}
                        </small>
                    </div>
                ))
            ) : (
                <p>No comments found.</p>
            )}
        </div>
    );
}
