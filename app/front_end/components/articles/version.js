import Image from "next/image";
import styles from "../../css/ArticleVersion.module.css";

function ArticleVersion({ version, index, onRestoreVersion }) {
    return (
        <div key={index} className={styles.versionCard}>
            <div className={styles.versionThumbnail}>
                <Image
                    src={
                        version.images && version.images.length > 0
                            ? version.images[0]
                            : "https://raw.githubusercontent.com/ijsto/reactnextjssnippets/master/images/logo02.png"
                    }
                    alt={`Version ${version.version}`}
                    layout="responsive"
                    width={100}
                    height={100}
                    objectFit="cover"
                />
            </div>
            <div className={styles.versionInfo}>
                <h3>Version {version.version}</h3>
                <p className={styles.versionDate}>
                    {version.date
                        ? new Date(version.date).toLocaleString()
                        : "Date not available"}
                </p>
                <p className={styles.versionPreview}>
                    {version.short_text || "No summary available"}
                </p>
                <p className={styles.versionText}>
                    {version.text || "No additional details provided"}
                </p>
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
