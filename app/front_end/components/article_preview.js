import Link from "next/link";
import Image from "next/image";
import 'bootstrap/dist/css/bootstrap.min.css';
import "../css/article_preview.css"


function ArticlePreview(preview) {
    preview = preview.preview;
    preview.images = "https://raw.githubusercontent.com/ijsto/reactnextjssnippets/master/images/logo02.png";
    return (
        <div className="card" style={{ width: "18rem" }}>
            <Image
                src={preview.images}
                className="card-img-top"
                width={100}
                height={200}
                alt="..."
            />
            <div className="card-body">
                <h5 className="card-title text-center">{preview.name}</h5>
                <p className="card-text fs-6 fw-light short-text">{preview.short_text}</p>
                <p className="d-flex justify-content-between">
                    <Link href={`/article_page?id=${preview._id}`} className="card-link">Read more</Link>
                    <span>by <Link href="#" className="card-link">{preview.author}</Link> </span>
                </p>
            </div>
        </div>
    );
}

export default ArticlePreview;