import Link from "next/link";
import Image from "next/image";
import styles from "../css/ArticlePreview.module.css"



function ArticlePreview({preview}) {
    if (!preview.images){
        preview.images = "https://raw.githubusercontent.com/ijsto/reactnextjssnippets/master/images/logo02.png";
    }
    return (
        <div className="card m-3" style={{ width: "18rem" }}>
            <Image
                src={preview.images}
                className="card-img-top"
                width={0}
                height={0}
                sizes="25vw"
                alt="..."
                style={{width:'100%', height:'auto'}}
            />
            <div className="card-body">
                <h5 className="card-title text-center">{preview.name}</h5>
                <p className={`${styles.shorttext} card-text fs-6 fw-light`}>{preview.short_text}</p>
                <p className="d-flex justify-content-between">
                    <Link href={`/article_page?id=${preview._id}`} className="card-link">Read more</Link>
                    <span>by <Link href="#" className="card-link">{preview.author}</Link> </span>
                </p>
            </div>
        </div>
    );
}

export default ArticlePreview;