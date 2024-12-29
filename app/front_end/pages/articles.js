import Link from "next/link";
import { useEffect, useState } from "react";

export default function ArticlesListPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_ARTICLES_API_URL}/api/v1/articles`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch articles");
        }
        return response.json();
      })
      .then((data) => {
        setArticles(data); // Aseguramos que los datos coincidan con la estructura del backend
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-danger">{error}</div>;

  return (
    <div className="container mt-5">
      <h2 className="text-center">All Articles</h2>
      <div className="row">
        {articles.map((article) => (
          <div key={article._id} className="col-md-4">
            <div className="card mb-3">
              <img
                src={article.images?.[0] || "/placeholder.jpg"}
                className="card-img-top"
                alt={article.name || "Article Image"}
              />
              <div className="card-body">
                <h5 className="card-title">{article.name}</h5>
                <p className="card-text">
                  {article.short_text || "No description available."}
                </p>
                {/* Ajustar el enlace para apuntar a la página `article_page.js` */}
                <Link href={`/article_page?id=${article._id}`} className="btn btn-primary">
                  Read More
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
