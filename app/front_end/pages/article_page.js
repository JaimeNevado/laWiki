import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Article from "../components/article"; // Assuming the Article component is in components/article.js
import ArticleLayout from "../components/article"; // Asumiendo que ArticleLayout muestra el artículo
import NewArticleForm from "../components/NewArticleForm";
import styles from "../css/ArticlePage.module.css"; // Importar los estilos

export default function ArticlePage() {
    const router = useRouter();
    const { id } = router.query; // Extraer el ID del artículo desde la URL
    const [article, setArticle] = useState(null);

    useEffect(() => {
        // Obtener el artículo solo cuando hay un ID disponible
        if (id) {
            fetch(`http://127.0.0.1:13001/api/v1/articles/${id}`)
                .then((response) => response.json())
                .then((data) => setArticle(data))
                .catch((error) => console.error("Error fetching article:", error));
        }
    }, [id]);

    return (
        <div className={styles.container}>

            {id ? (
                // Mostrar el artículo si se está accediendo a uno específico
                article ? (
                    <div className={styles.articleContent["article-content"]}>
                        <Article article={article} />
                    </div>
                ) : (
                    <div>Loading...</div>
                )
            ) : (
                // Mostrar el formulario si no hay un ID en la URL
                <div className={styles.button["new-article-form"]}>
                    <NewArticleForm />
                </div>
            )}
        </div>
    );
}
