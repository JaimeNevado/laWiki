import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Article from "../components/article"; // Componente para mostrar un artículo
import NewArticleForm from "../components/NewArticleForm"; // Formulario para crear un artículo
import styles from "../css/ArticlePage.module.css";

export default function ArticlePage() {
    const router = useRouter();
    const { id } = router.query; // Extraer el ID del artículo desde la URL
    const [article, setArticle] = useState(null);

    useEffect(() => {
        if (id) {
            // Obtener artículo por ID
            fetch(`http://127.0.0.1:13001/api/v1/articles/${id}`)
                .then((response) => response.json())
                .then((data) => setArticle(data))
                .catch((error) => console.error("Error fetching article:", error));
        }
    }, [id]);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Article Management</h1>

            {id ? (
                // Si hay un ID, mostrar el contenido del artículo
                article ? (
                    <div className={styles.articleContent}>
                        <Article article={article} />
                    </div>
                ) : (
                    <div>Loading...</div>
                )
            ) : (
                // Si no hay un ID, mostrar el formulario de creación
                <div className={styles.newArticleForm}>
                    <NewArticleForm />
                </div>
            )}
        </div>

        {/* Author and Date */}
        <div className="row">
          <div className="col-12 text-end">
            <p>
            by: <strong>{article.author}</strong><br />
              <strong>{article.date}</strong>
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="row">
          {/* Images Section */}
          <div className="col-md-4">
            <div className="mb-3">
              <Image
                src={main_img}
                className="img-fluid"
                width={0}
                height={0}
                sizes="25vw"
                alt="..."
                style={{width:"100%", height:"auto"}}
              />
            </div>
            <div className="px-10 py-10" style={{ backgroundColor: "lightblue" }}>
              Map placeholder
            </div>
          </div>

          {/* Text Section */}
          <div className="col-md-8">
            {article.text}
          </div>
        </div>
      </div>
    </article>
  );
};

export default Article;
