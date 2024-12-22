import Link from "next/link";
import Image from "next/image";
import styles from "../css/ArticlePreview.module.css"



function ArticlePreview({preview,previewVersion}) {
    //da problemas porque si mando previewVersion no existe preview
    // if (!preview.images){
    //     preview.images = "https://raw.githubusercontent.com/ijsto/reactnextjssnippets/master/images/logo02.png";
    // }
    return preview?(
        <div className={`card m-3 ${styles.cardMainDiv}`}>
            <div className={`${styles.cardImageDiv}`}>
                <Image
                    src={preview.images}
                    className="card-img-center"
                    width={0}
                    height={0}
                    sizes="25vw"
                    alt="..."
                    style={{
                        width: '100%',
                        height: 'auto',
                        objectFit: 'cover',
                        objectPosition: 'center'
                    }}
                />
            </div>
            <div className="card-body pt-1">
                <p className={`card-title text-center ${styles.cardTitle}`}>{preview.name}</p>
                <p className={`${styles.shorttext} card-text fs-6 fw-light`}>{preview.short_text}</p>
                <p className="d-flex justify-content-between">
                    <Link href={`/article_page?id=${preview._id}`} className="card-link">Read more</Link>
                    <span>by <Link href="#" className="card-link">{preview.author}</Link> </span>
                </p>
            </div>
        </div>
    ):previewVersion?(
        <>
        <h1>{previewVersion.short_text || "Texto corto"}</h1>
        <p>Version: {previewVersion.version|| "Version X"} </p>
        <p>Contenido:{previewVersion.text || "Tesxto"}</p>
        </>
    ):(<h4>loading</h4>);;
}

export default ArticlePreview;