import Image from "next/image";
import "bootstrap/dist/css/bootstrap.min.css";

// Componente Article
function Article({ article }) {
  let images = article.images || [];
  let main_img = images[0] || "https://raw.githubusercontent.com/ijsto/reactnextjssnippets/master/images/logo02.png";

  return (
    <article lang="en">
      <div className="container mt-4">
        {/* Article Header */}
        <div className="row">
          <div className="col-12">
            <h1 className="text-center">{article.name}</h1>
          </div>
        </div>

        {/* Subtitle - Short Text */}
        <div className="row mb-4">
          <div className="col-12">
            <h5 className="text-muted text-center">{article.short_text}</h5>
          </div>
        </div>
        
        {/* Author and Date */}
        <div className="row">
          <div className="col-12 text-end">
            <p>
              by: <strong>{article.author}</strong><br />
              <strong>{article.date}</strong>
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="row">
          {/* Images Section */}
          <div className="col-md-4">
            <div className="mb-3">
              <Image
                src={main_img}
                className="img-fluid"
                width={500} // Set fixed width, adjust as needed
                height={300} // Set fixed height, adjust as needed
                alt="Article Image"
                layout="intrinsic"
              />
            </div>
          </div>

          {/* Text Section */}
          <div className="col-md-8">
            {article.text}
          </div>
        </div>
      </div>
    </article>
  );
};

export default Article;
