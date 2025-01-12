import { useRouter } from "next/router";
import { useEffect } from "react";
import { useState } from "react";
import ArticlePreview from "../components/article_preview";


function Search() {
    const router = useRouter();
    const { query } = router.query;
    const [articleList, setArticleList] = useState(null);


    useEffect(() => {
        // console.log(`http://127.0.0.1:13001/api/v1/articles/preview?${query}`);
        const myDiv = document.getElementById('main_wrapper');
        if (myDiv){
            myDiv.style.backgroundImage = null ;
        }
        if (query) {
            fetch(`${process.env.NEXT_PUBLIC_ARTICLES_API_URL}/api/v1/articles/preview?${query}`)
                .then((res) => res.json())
                .then((data) => setArticleList(data))
                .catch((err) => console.error(err));
        }
    }, [query]);
    return (
        <>
            <div className="fs-3 text-center my-3">
                Results:
            </div>
            <div className="card-group d-flex justify-content-evenly">
                {articleList === null ? (
                    <p>Loading articles...</p>
                ) : articleList.length > 0 ? (
                    articleList.map((preview, index) => (
                        <div key={index}>
                            <ArticlePreview preview={preview} />
                        </div>
                    ))

                ) : (
                    <p>No articles found.</p>
                )}
            </div>
        </>
    );
}

export default Search;