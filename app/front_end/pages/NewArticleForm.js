import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

function useArticleForm(initialState) {
  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    setFormData(initialState); // Update only if the actual initialState changes
  }, [initialState]); // Dependency ensures this runs only when initialState changes

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    setFormData((prev) => ({ ...prev, [name]: file }));
  };

  return {
    formData,
    handleInputChange,
    handleFileChange,
  };
}

async function submitArticle(payload) {
  try {
      const response = await fetch("http://127.0.0.1:13001/api/v1/articles", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(payload), // Asegúrate de enviar los datos como JSON
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


function ArticleForm() {
  const router = useRouter();
  const { articleID } = router.query;
  const [article, setArticle] = useState(null);

  useEffect(() => {
    if (articleID) {
      fetch(`http://127.0.0.1:13001/api/v1/articles/${articleID}`)
        .then((res) => res.json())
        .then((data) => setArticle(data))
        .catch((err) => console.error(err));
    }
  }, [articleID]);

  const initData = useMemo(() => {
    return article
      ? {
          _id: article._id,
          title: article.title || "",
          content: article.content || "",
          author: article.author || "",
          image: null,
          image_url: article.image || "",
        }
      : {
          title: "",
          content: "",
          author: "",
          image: null,
        };
  }, [article]);

  const { formData, handleInputChange, handleFileChange } = useArticleForm(initData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();

      formDataToSend.append("title", formData.title);
      formDataToSend.append("content", formData.content);
      formDataToSend.append("author", formData.author);

      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      const result = await submitArticle({ articleID, payload: formDataToSend });
      if (result.inserted_id) {
        if (window.confirm("Article saved successfully! Click OK to view it.")) {
          router.push(`/article?articleID=${result.inserted_id}`);
        }
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error saving article.");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <h2>{articleID ? `Edit Article "${initData.title}"` : "Create New Article"}</h2>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="content">Content:</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="author">Author:</label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="image">Image:</label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
        <button type="submit">Save Article</button>
      </form>
    </>
  );
}

export default ArticleForm;
