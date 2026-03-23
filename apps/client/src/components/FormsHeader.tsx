import Link from "next/link";
import styles from "./formsHeader.module.css";

export function FormsHeader() {
  return (
    <header className={styles.topBar}>
      <div className={styles.brand}>
        <div className={styles.title}>Формы</div>
      </div>

      <div className={styles.searchShell} aria-label="Поиск">
        <div className={styles.searchIcon} aria-hidden="true" />
        <span className={styles.searchText}>Поиск</span>
      </div>

      <div className={styles.topBarActions}>
        <Link href="/forms/new" className={styles.iconButton} aria-label="Создать форму">
          +
        </Link>
      </div>
    </header>
  );
}
