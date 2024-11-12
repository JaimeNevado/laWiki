export const articleMetadata = {
    name: null,
    text: null,
    attachedFiles: null,
    author: null,
    images: null,
    googleMaps: null,
    date: null,
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
  