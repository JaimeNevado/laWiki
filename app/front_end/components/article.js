export const articleMetadata = {
    name: "wiki name",
    text: null,
    attachedFiles: null,
    author: "illya",
    images: null,
    googleMaps: null,
    date: "20 de noviembre de 2024",
    wikiID: null,
  }
  
  export default function ArticleLayout(article) {
    console.log(article);
    article = article.article;
    return (
      <article lang="en">
        <header>
          <h1>{article.name}</h1>
          <h3>by {article.author}</h3>
          <p>{article.date}</p>
          <p>id: {article._id}</p>
        </header>
        <body>
          <p>{article.text}</p>
          <p>{article.attachedFiles}</p>
          <p>{article.images}</p>
          <p>{article.googleMaps}</p>
          <p>{article.wikiID}</p>
        </body>
      </article>
    );
  }
  