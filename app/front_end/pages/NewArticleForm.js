import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";

async function submitArticle(payload) {
  try {
    const response = await fetch("http://127.0.0.1:13001/api/v1/articles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Failed to submit article: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("API submission error:", error);
    throw error;
  }
}

async function modifyArticle(articleID, payload) {
  try {
    const response = await fetch(`http://127.0.0.1:13001/api/v1/articles/${articleID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Failed to modify article: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("API modification error:", error);
    throw error;
  }
}

async function deleteArticle(articleID) {
  try {
    const response = await fetch(`http://127.0.0.1:13001/api/v1/articles/${articleID}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Failed to delete article: ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error("API deletion error:", error);
    throw error;
  }
}

function ArticleForm() {
  const router = useRouter();
  const { articleID } = router.query;
  const [article, setArticle] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
  });

  useEffect(() => {
    if (articleID) {
      fetch(`http://127.0.0.1:13001/api/v1/articles/${articleID}`)
        .then((res) => res.json())
        .then((data) => {
          setArticle(data);
          setFormData({
            title: data.title || "",
            description: data.description || "",
            content: data.content || "",
          });
        })
        .catch((err) => console.error(err));
    }
  }, [articleID]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        content: formData.content,
      };

      let result;
      if (articleID) {
        result = await modifyArticle(articleID, payload);
      } else {
        result = await submitArticle(payload);
      }

      if (result._id) {
        alert("Article saved successfully!");
        router.push(`/article/${result._id}`);
      } else {
        throw new Error("Invalid response from server.");
      }
    } catch (error) {
      console.error("Error saving article:", error);
      alert("Error saving article.");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this article?")) {
      try {
        await deleteArticle(articleID);
        alert("Article deleted successfully!");
        router.push(`/`);
      } catch (error) {
        console.error("Error deleting article:", error);
        alert("Error deleting article.");
      }
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">
        {articleID ? `Edit Article: "${formData.title}"` : "Create New Article"}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Title
          </label>
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
        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            className="form-control"
            value={formData.description}
            onChange={handleInputChange}
            required
          ></textarea>
        </div>
        <div className="mb-3">
          <label htmlFor="content" className="form-label">
            Content
          </label>
          <textarea
            id="content"
            name="content"
            className="form-control"
            rows="5"
            value={formData.content}
            onChange={handleInputChange}
            required
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary">
          {articleID ? "Update Article" : "Create Article"}
        </button>
        {articleID && (
          <button
            type="button"
            className="btn btn-danger ms-3"
            onClick={handleDelete}
          >
            Delete Article
          </button>
        )}
      </form>
    </div>
  );
}

export default ArticleForm;
