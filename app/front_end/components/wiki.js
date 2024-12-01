import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ArticlePreview from './article_preview';
import Image from 'next/image';
import LinkButton from './buttons/button_with_link';
import "../css/page_content.css";
import "../css/wiki_page.css";


function WikiSkeleton({ wiki }) {
  const router = useRouter();
  return (
    <div className="container mt-4">
      <div className='text-end'>
        <LinkButton btn_type={"btn-primary"} button_text="Edit Wiki" state="enabled" link="/wiki/wiki_form" func={() => router.push({
            pathname: "/wiki/wiki_form",
            query: {wikiID: wiki._id},
          })
        } />
      </div>
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
              width={0}
              height={0}
              sizes='25vw'
              alt="Wiki logo"
              style={{ width: "100%", height: "auto" }}
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


const Wiki = ({ wiki }) => {
  const router = useRouter();
  // console.log(wiki);
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
    <>
      <div className="page-content wiki-page">
        <div>
          <WikiSkeleton wiki={wiki} />
        </div>
        <div className='fw-medium fs-4 text-center'>
          Some articles to read:
        </div>
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
          <div className='text-end me-2'>
            <LinkButton btn_type={"btn-primary"} button_text="Create Article" state="enabled" link="/article/NewArticleForm" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Wiki;