import { useEffect, useState } from "react";
import ArticleLayout from "../components/article"; // Assuming this displays the article
import NewArticleForm from "../components/NewArticleForm";
import styles from "../css/ArticlePage.module.css"; // Importing styles
import { useRouter } from 'next/router';

export default function ArticlePage() {
    const router = useRouter();
    const { id } = router.query; // Extract article ID from URL
    const [article, setArticle] = useState(null);

    // Utility function to fetch article data
    useEffect(() => {
        if (id) {
            fetch(`http://127.0.0.1:13001/api/v1/articles/${id}`)
                .then((response) => response.json())
                .then((data) => setArticle(data))
                .catch((error) => console.error("Error fetching article:", error));
        }
    }, [id]);

    // Function to fetch location and redirect
    const getMessage = async () => {
        const lugar = 'malaga'; // Example query parameter
        const url = "http://nominatim.openstreetmap.org/search?q=" + lugar + 
                                "&format=json&addressdetails=1";
        console.log(url);

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log(data);
            console.log(`Coordenadas: ${data[0].lat}, ${data[0].lon}`); // Assuming similar data structure

            // Redirect to another page with coordinates in query params
            router.push(`https://www.openstreetmap.org/?mlat=${data[0].lat}&mlon=${data[0].lon}#map=14/${data[0].lat}/${data[0].lon}`);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Article Management</h1>

            {id ? (
                article ? (
                    <div className={styles.articleContent["article-content"]}>
                        <ArticleLayout article={article} />
                    </div>
                ) : (
                    <div>Loading...</div>
                )
            ) : (
                <div className={styles.button["new-article-form"]}>
                    <NewArticleForm />
                </div>
            )}

            {/* Add the link to trigger getMessage */}
            <div>
                <p>
                    <a href="#" onClick={(e) => { e.preventDefault(); getMessage(); }}>
                        Málaga
                        
                    </a>
                </p>
            </div>
        </div>
    );
}

//    function getMessage(){
//                 xhttp = new XMLHttpRequest();
//                 xhttp.onreadystatechange = handleResponse;
//                 var lugar = "malaga";
//                 console.log(url);
//                 xhttp.open("GET", url, true);
//                 xhttp.send(null);
//     }
//   function handleResponse() {
                 
//     if (xhttp.readyState == 4 && xhttp.status == 200) {
                        
//     var response = xhttp.responseText;
                    
//     var texto = JSON.parse(response);
//         console.log(texto);  
//         console.log("Coordenadas: " + texto[0].lat + "," + texto[0].lon); // coords. del primer resultado
//         window.location.href = "showMap2.html?lon=" + texto[0].lon + "&lat=" + texto[0].lat;
    
//     }
//  }
