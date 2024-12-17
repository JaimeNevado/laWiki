import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Article from "../components/article";
import LinkButton from "../components/buttons/button_with_link";
import styles from "../css/ArticlePage.module.css";
import fetchData from "../components/utils/fetchData";

export default function ArticlesListPage() {
  const router = useRouter();
  const { id } = router.query;
  const [article, setArticle] = useState(null);
  const [wikibg, setWikiBg] = useState(null);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]); // State to hold comments
  const [newComment, setNewComment] = useState(""); // State for new comment input

  useEffect(() => {
    if (id) {
      // Fetching article data
      fetchData(
        `http://127.0.0.1:13001/api/v1/articles/${id}`,
        setArticle,
        setError
      );
      // Fetching wiki background image
      fetchData(
        `http://127.0.0.1:13001/api/v1/articles/${id}/wiki`,
        (data) => setWikiBg(data.bg_image),
        setError
      );
      // Fetching comments data
      fetchData(
        `http://127.0.0.1:13001/api/v1/articles/${id}/comments/`,
        (data) => {
          // Ensure the response is an array
          setComments(Array.isArray(data) ? data : []);
        },
        setError
      );
    }
  }, [id]);

  useEffect(() => {
    const myDiv = document.getElementById("main_wrapper");
    if (myDiv) {
      myDiv.style.backgroundImage = wikibg ? `url(${wikibg})` : "none";
      myDiv.style.backgroundSize = "cover";
      myDiv.style.backgroundPosition = "center";
      myDiv.style.height = "auto";
      myDiv.style.width = "100vw";
      myDiv.style.zIndex = "-1";
    }
  }, [wikibg]);

  const getMessage = async () => {
    const lugar = article?.googleMaps || "defaultLocation";
    const url = `http://nominatim.openstreetmap.org/search?q=${lugar}&format=json&addressdetails=1`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch location");
      const data = await response.json();
      router.push(`https://www.openstreetmap.org/?mlat=${data[0].lat}&mlon=${data[0].lon}#map=14/${data[0].lat}/${data[0].lon}`);
    } catch (err) {
      console.error("Error fetching location:", err);
      setError("Error fetching location");
    }
  };

  // Handle comment submission
  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!newComment) return; // Do nothing if comment is empty

    try {
      const response = await fetch("http://127.0.0.1:13001/api/v1/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          article_id: id,
          author_id: "default_user", // Replace with the actual user ID if available
          title: article?.title || "No Title",
          content: newComment,
        }),
      });

      if (!response.ok) throw new Error("Failed to add comment");

      // Update comments list by adding the new comment
      const newCommentData = await response.json();
      setComments((prevComments) => [
        ...prevComments,
        { content: newComment, author_id: "default_user", date: new Date() },
      ]);
      setNewComment(""); // Reset the comment input
    } catch (error) {
      console.error("Error adding comment:", error);
      setError("Error adding comment");
    }
  };

  if (error) return <p className="text-danger text-center">{error}</p>;

  return (
    <div id="main_wrapper" className={`${styles.container} mx-0`}>
      {id ? (
        article ? (
          <>
            <div className={styles.articleContent}>
              <Article article={article} />
            </div>
            <div>
              <p>
                <a href="#" onClick={(e) => { e.preventDefault(); getMessage(); }}>
                  {article?.googleMaps || "Google Maps data not available"}
                </a>
              </p>
            </div>
            {/* Displaying comments */}
            <div>
              <h3>Comments</h3>
              <ul>
                {Array.isArray(comments) && comments.length > 0 ? (
                  comments.map((comment, index) => (
                    <li key={index}>
                      <p><strong>{comment.author_id}</strong>: {comment.content}</p>
                      <p>{new Date(comment.date).toLocaleString()}</p>
                    </li>
                  ))
                ) : (
                  <p>No comments available.</p>
                )}
              </ul>
            </div>

            {/* Comment form */}
            <div>
              <h4>Add a Comment</h4>
              <form onSubmit={handleCommentSubmit}>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows="4"
                  cols="50"
                  placeholder="Write your comment..."
                />
                <br />
                <button type="submit">Submit Comment</button>
              </form>
            </div>
          </>
        ) : (
          <div>Loading...</div>
        )
      ) : (
        <>
          <div className="fs-3 text-center">Article Not Found</div>
          <div className="text-center me-2">
            <LinkButton btn_type="btn-primary" button_text="Create Article" state="enabled" link="/article/new-article-form" />
          </div>
        </>
      )}
    </div>
  );
}
