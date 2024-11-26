import React, { useEffect, useState } from 'react';
// import ArticleLayout from '../components/article';
import ArticlePreview from '../components/article_preview';
import axios from "axios";



const Wiki = (wiki) => {
  wiki = wiki.wiki;
  let wikiID
  if (!wiki) {
    wikiID = '6717e076740a32803fb26f21'; // temporarely send a hardcoded wikiID
  } else {
    wikiID = wiki.wikiID;
  }

  const articlesEndpoint = "http://127.0.0.1:13000/api/v1/wikis/" + wikiID + "/previewArticles";
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    // Fetching data from the endpoint
    const fetchArticles = async () => {
      try {
        //const response = await axios.get(articlesEndpoint);
        const response = await fetch(articlesEndpoint);
         if (!response.ok) {
           throw new Error(`Error fetching articles: ${response.statusText}`);
         }
         const data = await response.json(); // Assuming the response is JSON
        setArticles(data); //data para el anterior
      } catch (error) {
        console.error(error);
      }
      
    };

    fetchArticles();
  }, []); // Empty dependency array ensures the effect runs only once

  return (
    <div>
      <div className="card-group d-flex justify-content-evenly">
        {articles.length > 0 ? (
          articles.map((preview, index) => (
            <div key={index}>
              <ArticlePreview preview={preview} />
            </div>
          ))
        ) : (
          <p>Loading articles...</p>
        )}
      </div>
    </div>
  );
};

export default Wiki;