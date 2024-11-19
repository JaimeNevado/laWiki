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
  
  export default function ArticleLayout() {
    return (
      <article lang="en">
        <header>
          <h1>{articleMetadata.name}</h1>
          <p>By {articleMetadata.author}</p>
          <time>{articleMetadata.date}</time>
        </header>
      </article>
    )
  }
  