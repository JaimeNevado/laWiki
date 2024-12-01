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

    useEffect(() => {
        // This code runs on the client side only
        const myDiv = document.getElementById('main_wrapper');
        if (myDiv) {
          myDiv.style.backgroundImage = wiki ? `url(${wiki.bg_image})` : '#fcfcfc' ;
          myDiv.style.backgroundSize = 'cover';
          myDiv.style.backgroundPosition = 'center';
          myDiv.style.height = 'auto'; // Adjust as needed
          myDiv.style.width = '100vw';
          //position: "absolute",
          myDiv.style.zIndex = "-1";
        } 
      });

    // Pass the article data to the Article component
    return (
        <>
            {wiki ? (
                <>
                <Wiki wiki={wiki} />
                </>
            ):(
                <div>Loading...</div>
            )}
        </>
    );
}

export default WikiPage