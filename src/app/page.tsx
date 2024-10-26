import Image from "next/image";
import styles from "./page.module.css";
import  UsersPage from "./users/page";
export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <UsersPage />
      </main>
      <footer className={styles.footer}>
      </footer>
    </div>
  );
}