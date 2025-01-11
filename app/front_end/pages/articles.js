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
        setArticles(data);
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
      <div className="row g-3"> {/* Clase g-3 agrega espacio entre filas y columnas */}
        {articles.map((article) => (
          <div key={article._id} className="col-md-4 d-flex">
            <div
              className="card mb-3 d-flex flex-column"
              style={{
                flex: "1 1 auto",
                display: "flex",
                height: "100%",
              }}
            >
              <img
                src={article.images?.[0] || "/placeholder.jpg"}
                className="card-img-top img-fluid"
                alt={article.name || "Article Image"}
                style={{
                  height: "150px", // Ajusta la altura de la imagen
                  objectFit: "cover",
                }}
              />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{article.name}</h5>
                <p
                  className="card-text"
                  style={{
                    flexGrow: 1, // Hace que el texto ocupe espacio dinámico
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {article.short_text || "No description available."}
                </p>
                <Link
                  href={`/article_page?id=${article._id}`}
                  className="btn btn-primary mt-auto"
                >
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
