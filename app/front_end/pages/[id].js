import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function ArticleDetailsPage() {
  const router = useRouter();
  const { id } = router.query;
  const [article, setArticle] = useState(null);
  const [error, setError] = useState(null);

// hello
  useEffect(() => {
    if (id) {
      fetch(`${process.env.NEXT_PUBLIC_ARTICLES_API_URL}/api/v1/articles/${id}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch article details");
          }
          return response.json();
        })
        .then((data) => setArticle(data))
        .catch((err) => setError(err.message));
    }
  }, [id]);

  if (error) {
    return <p className="text-danger text-center">{error}</p>;
  }

  if (!article) {
    return <p className="text-center">Loading...</p>;
  }

  return (
    <div className="container mt-5">
      <h2>{article.title}</h2>
      <img
        src={article.image || "/placeholder.jpg"}
        alt={article.title || "Article Image"}
        className="img-fluid my-3"
      />
      <p>
        <strong>Description:</strong> {article.description}
      </p>
      <div>
        <strong>Content:</strong>
        <p>{article.content}</p>
      </div>
    </div>
  );
}
