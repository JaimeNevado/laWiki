import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Article from "../components/article"; // Assuming the Article component is in components/article.js

export default function ArticlePage() {
    const router = useRouter();
    const { id } = router.query; // Extract the article ID from the query string
    const [article, setArticle] = useState(null);

    useEffect(() => {
        // Fetch the article only when the id is available
        if (id) {
            fetch(`http://127.0.0.1:13001/api/v1/articles/${id}`)
                .then((response) => response.json())
                .then((data) => setArticle(data))
                .catch((error) => console.error("Error fetching article:", error));
        }
    }, [id]);

    // Display a loading state while fetching
    if (!article) return <div>Loading...</div>;

    // Pass the article data to the Article component
    return <Article article={article} />;
}