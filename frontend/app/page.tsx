import ClientPage from "./ClientPage";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h4>$SAMI</h4>
        <ClientPage />
      </main>
    </div>
  );
}
