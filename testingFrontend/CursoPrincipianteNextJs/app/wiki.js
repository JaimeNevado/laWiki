export const wikiMetadata = {
    name: "Nombre de la wiki",
    description:"Descripción de la wiki",
    author: "Nombre del autor",
  }
  
export default function HomePage() {
    return (
        <div>
            <h1>{wikiMetadata.name}</h1>
            <p>{wikiMetadata.description}</p>
            <p>{wikiMetadata.author}</p>
        </div>
    );
  }