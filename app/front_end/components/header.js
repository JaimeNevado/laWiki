
import styles from '../css/header.module.css'; // Asegúrate de tener este archivo CSS

function Header() {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>LaWiki</h1>
    </header>
  );
}

export default Header;
