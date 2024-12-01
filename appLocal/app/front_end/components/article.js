import Image from "next/image";
import "bootstrap/dist/css/bootstrap.min.css";

function Article(article) {
  article = article.article;
  let images = article.images;
  let main_img = images[0];
  main_img = "https://raw.githubusercontent.com/ijsto/reactnextjssnippets/master/images/logo02.png";
  return (
    <article lang="en">
      <div className="container mt-4">
        {/* Article Header */}
        <div className="row">
          <div className="col-12">
            <h1 className="text-center">{article.name}</h1>
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
                width={0}
                height={0}
                sizes="25vw"
                alt="..."
                style={{width:"100%", height:"auto"}}
              />
            </div>
            <div className="px-10 py-10" style={{ backgroundColor: "lightblue" }}>
              Map placeholder
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