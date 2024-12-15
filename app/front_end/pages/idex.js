import Link from "next/link";
import { useEffect, useState } from "react";

export default function ArticlesListPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:13001/api/v1/articles")
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
      <div className="row">
        {articles.map((article) => (
          <div key={article._id} className="col-md-4">
            <div className="card mb-3">
              <img
                src={article.image || "/placeholder.jpg"}
                className="card-img-top"
                alt={article.title || "Article Image"}
              />
              <div className="card-body">
                <h5 className="card-title">{article.title}</h5>
                <p className="card-text">
                  {article.description || "No description available."}
                </p>
                <Link href={`/articles/${article._id}`}>
                  <a className="btn btn-primary">Read More</a>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
