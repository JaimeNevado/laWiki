import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ArticleLayout from "../components/article"; // Asumiendo que ArticleLayout muestra el artículo
import NewArticleForm from "../components/NewArticleForm";
import styles from "../css/ArticlePage.module.css"; // Importar los estilos

export default function ArticlePage() {
    const router = useRouter();
    const { id } = router.query; // Extraer el ID del artículo desde la URL
    const [article, setArticle] = useState(null);

   

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Tittle</h1>

        </div>
    );
}
