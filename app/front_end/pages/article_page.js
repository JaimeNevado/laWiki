import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Article from "../components/article";
import styles from "../css/ArticlePage.module.css";
import fetchData from "../components/utils/fetchData";

export default function ArticlesListPage() {
  const router = useRouter();
  const { id } = router.query;
  const [article, setArticle] = useState(null);
  const [wikiName, setWikiName] = useState("");
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [selectedRating, setSelectedRating] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchData(`http://127.0.0.1:13001/api/v1/articles/${id}`, (data) => {
        setArticle(data);
        if (data.wikiID) {
          fetchData(`http://127.0.0.1:13000/api/v1/wikis/${data.wikiID}`, (wikiData) => {
            setWikiName(wikiData.name || "Wiki Not Found");
          }, setError);
        }
      }, setError);

      fetchData(`http://127.0.0.1:13001/api/v1/articles/${id}/comments/`, (data) => {
        setComments(Array.isArray(data) ? data : []);
      }, setError);
    }
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment || !selectedRating) return;

    try {
      const response = await fetch("http://127.0.0.1:13002/api/v1/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          article_id: id,
          author_id: "default_user",
          content: newComment,
          rating: selectedRating,
        }),
      });

      if (!response.ok) throw new Error("Failed to add comment");

      setComments((prev) => [
        ...prev,
        { content: newComment, author_id: "default_user", date: new Date(), rating: selectedRating },
      ]);
      setNewComment("");
      setSelectedRating(null);
    } catch (error) {
      setError("Error adding comment");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this article?")) return;
    
    try {
      const response = await fetch(`http://127.0.0.1:13001/api/v1/articles/${article._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) throw new Error("Failed to delete article");
      
      router.push(`/wiki/${article.wikiID}`);
    } catch (err) {
      setError("Error deleting article");
    }
  };

  if (error) return <p className="text-danger text-center">{error}</p>;

  return (
    <div id="main_wrapper" className={`${styles.container}`}>
      {article ? (
        <>
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
  
</div>


            <Article article={article} />
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
          </form>

          <div style={{ marginBottom: "40px" }}>
            <h2>Versions</h2>
            <div className={styles.versionsSection}>
              {article.versions.map((version, index) => (
                <div key={index} className={styles.versionCard} style={{ marginBottom: "20px" }}>
                  <h4>Version {version.version}</h4>
                  <p>{version.text}</p>
                  <button className={`${styles.button} ${styles.restoreButton}`} onClick={() => handleRestoreVersion(version)}>Restore Version</button>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}