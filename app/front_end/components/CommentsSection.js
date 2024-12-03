import { useState, useEffect } from "react";

export default function CommentsSection({ articleId }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState({ title: "", body: "" });
    const [loading, setLoading] = useState(true);

    // Fetch comments for the given article
    useEffect(() => {
        if (articleId) {
            fetch(`http://127.0.0.1:8000/api/v1/${articleId}/comments/`)
                .then((response) => response.json())
                .then((data) => {
                    setComments(data);
                    setLoading(false);
                })
                .catch((error) => console.error("Error fetching comments:", error));
        }
    }, [articleId]);

    // Handle new comment submission
    const handleSubmit = (e) => {
        e.preventDefault();
        const commentData = {
            ...newComment,
            article_id: articleId,
            author_id: "dummyAuthorId", // Replace with actual author ID
            date: new Date().toISOString(),
        };

        fetch("http://127.0.0.1:8000/api/v1/comments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(commentData),
        })
            .then((response) => response.json())
            .then(() => {
                setComments([...comments, commentData]); // Update the comment list
                setNewComment({ title: "", body: "" }); // Clear the form
            })
            .catch((error) => console.error("Error adding comment:", error));
    };

    const handleInputChange = (e) => {
        setNewComment({ ...newComment, [e.target.name]: e.target.value });
    };

    return (
        <div className="comments-section">
            <h3>Comments</h3>
            {loading ? (
                <p>Loading comments...</p>
            ) : comments.length > 0 ? (
                comments.map((comment, index) => (
                    <div key={index} className="comment">
                        <h4>{comment.title}</h4>
                        <p>{comment.body}</p>
                        <small>By: {comment.author_id} on {new Date(comment.date).toLocaleString()}</small>
                    </div>
                ))
            ) : (
                <p>No comments yet. Be the first to comment!</p>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        className="form-control"
                        value={newComment.title}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="body" className="form-label">Comment</label>
                    <textarea
                        id="body"
                        name="body"
                        className="form-control"
                        value={newComment.body}
                        onChange={handleInputChange}
                        required
                    ></textarea>
                </div>
                <button type="submit" className="btn btn-primary">Add Comment</button>
            </form>
        </div>
    );
}
