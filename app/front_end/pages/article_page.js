import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Article from "../components/article";
import ArticleLayout from "../components/article"; // Asumiendo que ArticleLayout muestra el artículo
import NewArticleForm from "./article/NewArticleForm";
import styles from "../css/ArticlePage.module.css"; // Importar los estilos
import LinkButton from '../components/buttons/button_with_link';

export default function ArticlePage() {
    const router = useRouter();
    const { id } = router.query; // Extraer el ID del artículo desde la URL
    const [article, setArticle] = useState(null);
    const [wikibg, setWikiBg] = useState(null);

    useEffect(() => {
        // Obtener el artículo solo cuando hay un ID disponible
        if (id) {
            fetch(`http://127.0.0.1:13001/api/v1/articles/${id}`)
                .then((response) => response.json())
                .then((data) => setArticle(data))
                .catch((error) => console.error("Error fetching article:", error));
            
            fetch(`http://127.0.0.1:13001/api/v1/articles/${id}/wiki`)
                .then((response) => response.json())
                .then((data) => setWikiBg(data.bg_image))
                .catch((error) => console.error("Error fetching wiki of the article article:", error));
        }
    }, [id]);

    return (
        <>
        
        <div style={{
                backgroundImage: `url(${wikibg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '100vh', // Adjust as needed
                width: '100vw',
                position: "absolute",
                zIndex: "-1"
            }}>
        </div>
        
        <div className="page-content">
            <div className={`${styles.container} mx-0`}>

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
                    <>
                    <div className="fs-3 text-center">Article Not Found</div>
                    <div className='text-center me-2'>
                        <LinkButton btn_type={"btn-primary"} button_text="Create Article" state="enabled" link="/article/NewArticleForm"/>
                    </div>
                    </>
                )}
            </div>
        </div>
        
        </>
    );
}
