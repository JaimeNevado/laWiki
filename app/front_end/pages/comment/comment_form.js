import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";

function useCommentForm(initialState) {
  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    setFormData(initialState); // Update only if the initialState changes
  }, [initialState]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return {
    formData,
    handleInputChange,
  };
}

async function submitComment(payload) {
  try {
    const response = await fetch("http://127.0.0.1:13000/api/v1/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Failed to submit comment: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("API submission error:", error);
    throw error;
  }
}

function CommentForm() {
  const router = useRouter(); // Initialize router
  const { articleID } = router.query;

  const initData = useMemo(() => {
    return {
      date: new Date().toISOString(),
      title: "",
      body: "",
      article_id: articleID || "",
      author_id: "", // Replace with the actual user ID if available
      author: "", // Replace with the actual author name if available
    };
  }, [articleID]);

  const { formData, handleInputChange } = useCommentForm(initData);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        date: new Date().toISOString(), // Ensure the date is current
      };

      const result = await submitComment(payload);

      if (result.inserted_id) {
        alert("Comment submitted successfully!");
        router.push(`/article?articleID=${formData.article_id}`);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
      alert("Error submitting comment.");
    }
  };

  return (
    <div className="container mt-5">
      <form onSubmit={handleSubmit}>
        <h2 className="text-center">Leave a Comment</h2>

        <div className="form-element">
          <label htmlFor="title" className="form-label">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            className="form-control"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-element">
          <label htmlFor="body" className="form-label">Comment:</label>
          <textarea
            id="body"
            name="body"
            className="form-control"
            value={formData.body}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-element">
          <label htmlFor="author" className="form-label">Author:</label>
          <input
            type="text"
            id="author"
            name="author"
            className="form-control"
            value={formData.author}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-element">
          <button type="submit" className="btn btn-primary my-4">
            Submit Comment
          </button>
        </div>
      </form>
    </div>
  );
}

export default CommentForm;
