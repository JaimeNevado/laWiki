import Link from "next/link";
import { useEffect, useState } from "react";

export default function ArticlesListPage() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:13001/api/v1/articles")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch articles");
        }
        return response.json();
      })
      .then((data) => setArticles(data))
      .catch((error) => console.error("Error fetching articles:", error));
  }, []);

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
                alt={article.name || "Article Image"}
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
