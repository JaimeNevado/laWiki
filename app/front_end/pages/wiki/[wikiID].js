import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Wiki from "../../components/wiki";

function WikiPage() {
    const router = useRouter();
    const { wikiID } = router.query;
    const [wiki, setWiki] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (wikiID) {
            setLoading(true);
            fetch(`http://127.0.0.1:13000/api/v1/wikis/${wikiID}`)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then((data) => {
                    setWiki(data);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching article:", error);
                    setError("Failed to load wiki content.");
                    setLoading(false);
                });
        }
    }, [wikiID]);

    useEffect(() => {
        const myDiv = document.getElementById('main_wrapper');
        if (myDiv && wiki) {
            const bgImage = wiki.bg_image || '#fcfcfc';
            myDiv.style.backgroundImage = `url(${bgImage})`;
            myDiv.style.backgroundSize = 'cover';
            myDiv.style.backgroundPosition = 'center';
            myDiv.style.height = 'auto';
            myDiv.style.width = '100vw';
            myDiv.style.zIndex = "-1";
        }
    }, [wiki]);

    return (
        <>
            {loading ? (
                <div>Loading...</div>
            ) : error ? (
                <div>{error}</div>
            ) : (
                <Wiki wiki={wiki} />
            )}
        </>
    );
}

export default WikiPage;
