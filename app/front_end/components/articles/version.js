import Image from "next/image";
import styles from "../../css/ArticleVersion.module.css";

function ArticleVersion({ version, index, onRestoreVersion }) {
    return (
        <div key={index} className={styles.versionCard}>
            <div className={styles.versionThumbnail}>
                <Image
                    src={version.images[0] || 'https://raw.githubusercontent.com/ijsto/reactnextjssnippets/master/images/logo02.png'}
                    alt={`Version ${version.version}`}
                    width={0}
                    height={0}
                    sizes="100px"
                    objectFit="cover"
                    style={{ width: "100%", height: "auto" }}
                />
            </div>
            <div className={styles.versionInfo}>
                <h3>Version {version.version}</h3>
                <p className={styles.versionDate}>{new Date(version.date).toLocaleString()}</p>
                <p className={styles.versionPreview}>{version.short_text}</p>
                <p className={styles.versionText}>{version.text}</p>
                <button
                    className={styles.restoreButton}
                    onClick={() => onRestoreVersion(version)}
                >
                    Restore Version
                </button>
            </div>
        </div>
    );
}

export default ArticleVersion;