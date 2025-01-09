import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import ArticlePreview from './article_preview';
import Image from 'next/image';
import LinkButton from './buttons/button_with_link';

import styles from "../css/Wiki.module.css";

function WikiSkeleton({ wiki }) {
  const router = useRouter();
  const [storedUser, setStoredUser] = useState(null);
  const [canEdit, setCanEdit] = useState(false);
 
  useEffect(() => {
    setStoredUser(JSON.parse(localStorage.getItem("user")));
    setCanEdit(storedUser && storedUser.name === wiki.author);
  },[wiki]);

  return (
    <div className="container pt-3 mt-1">
      <div className='text-end'>
        {canEdit && (
        <LinkButton btn_type={"btn-primary"} button_text="Edit Wiki" state="enabled" link="/wiki/wiki_form" func={() => router.push({
          pathname: "/wiki/wiki_form",
          query: { wikiID: wiki._id },
        })
        } />
        )}
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
   const [user, setUser] = useState(null);

  useEffect(() => {
    const userFromLocalStorage = JSON.parse(localStorage.getItem("user"));
    setUser(userFromLocalStorage || null); // Permite que el usuario sea null
  }, []);
  const router = useRouter();
  let { id } = router.query;
  if (!wiki) {
    id = '6752e6c677c86b2a52cb9335'; // Temporarily sending a hardcoded wikiID
  } else {
    id = wiki._id;
  }

  const articlesEndpoint = `${process.env.NEXT_PUBLIC_WIKI_API_URL}/api/v1/wikis/${id}/previewArticles`;
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
      <div className={`${styles.wikipage}`}>
        <div>
          <WikiSkeleton wiki={wiki} />
        </div>
        {/* Correct link for creating article */}
        <div className='fw-medium fs-4 text-center'>
          Some articles to read:
        </div>
        <div className='text-center my-2'>
          {user ? (
            <LinkButton
             btn_type={"btn-primary"} 
             button_text="Write New Article" 
             state="enabled" 
             link={`/NewArticleForm?wikiID=${wiki._id}`} />
          ) : ""}
        </div>
        <div className="card-group d-flex justify-content-evenly">
          {articles.length > 0 ? (
            articles.map((preview, index) => (
              <div key={index}>
                <ArticlePreview preview={preview} />
              </div>
            ))
          ) : (
            <p>{articles.length === 0 ? "No hay artículos disponibles." : "Loading articles..."}</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Wiki;
