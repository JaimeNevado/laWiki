import React, { useEffect, useState } from 'react';
// import ArticleLayout from '../components/article';
import ArticlePreview from './article_preview';
import Image from 'next/image';

function WikiSkeleton(wiki){
  wiki = wiki.wiki;
  return (
    <div className="container mt-4">
    {/* Article Header */}
    <div className="row">
      <div className="col-12">
        <h1 className="text-center">{wiki.name}</h1>
      </div>
    </div>

    {/* Author */}
    <div className="row">
      <div className="col-12 text-end">
        <p>
        by: <strong>{wiki.author}</strong><br />
        </p>
      </div>
    </div>

    {/* Main Content */}
    <div className="row">
      {/* Images Section */}
      <div className="col-md-4">
        <div className="mb-3">
          <Image
            src={wiki.logo}
            className="img-fluid"
            width={100}
            height={200}
            alt="..."
          />
        </div>
      </div>

      {/* Text Section */}
      <div className="col-md-8">
        {wiki.description}
      </div>
    </div>
  </div>
  );
}


const Wiki = (wiki) => {
  wiki = wiki.wiki;
  console.log(wiki);
  let id
  if (!wiki) {
    id = '6717e076740a32803fb26f21'; // temporarely send a hardcoded wikiID
  } else {
    id = wiki._id;
  }

  const articlesEndpoint = "http://127.0.0.1:13000/api/v1/wikis/" + id + "/previewArticles";
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    // Fetching data from the endpoint
    const fetchArticles = async () => {
      try {
        const response = await fetch(articlesEndpoint);
        if (!response.ok) {
          throw new Error(`Error fetching articles: ${response.statusText}`);
        }
        const data = await response.json(); // Assuming the response is JSON
        setArticles(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchArticles();
  }, []); // Empty dependency array ensures the effect runs only once

  return (
    <div>
      <Image src={wiki.background_img} fill={true} />
      <div>
        <WikiSkeleton wiki={wiki} />
      </div>
      <div className="card-group d-flex justify-content-evenly">
        {articles.length > 0 ? (
          articles.map((preview, index) => (
            <div key={index}>
              console.log(preview);
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