import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Wiki from "../components/wiki"; // Assuming the Article component is in components/article.js

function WikiPage() {
    const router = useRouter();
    const { wikiID } = router.query; // Extract the article ID from the query string
    const [wiki, setWiki] = useState(null);

    useEffect(() => {
        // Fetch the article only when the id is available
        if (wikiID) {
            fetch(`http://127.0.0.1:13000/api/v1/wikis/${wikiID}`)
                .then((response) => response.json())
                .then((data) => setWiki(data))
                .catch((error) => console.error("Error fetching article:", error));
        }
    }, [wikiID]);

    // Display a loading state while fetching
    if (!wiki) return <div>Loading...</div>;

    // Pass the article data to the Article component
    return <Wiki wiki={wiki} />;
}
export default WikiPage   