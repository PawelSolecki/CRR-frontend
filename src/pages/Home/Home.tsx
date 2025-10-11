import { FileText } from "lucide-react";
import { Link } from "react-router-dom";
import styles from "./Home.module.scss";

export default function Home() {
  return (
    <div className={styles.home}>
      <header className={styles.topBar}>
        <div className={styles.logo}>CRR</div>
      </header>

      <section className={styles.hero}>
        <div className={styles.icon}>
          <FileText size={96} />
        </div>
        <h1>Build Your Perfect CV</h1>
        <p className={styles.subtitle}>
          Create a professional CV tailored to your dream job in just few simple
          steps
        </p>
        <Link to="/upload-cv" className={styles.cta}>
          Let's go
        </Link>
      </section>
    </div>
  );
}
