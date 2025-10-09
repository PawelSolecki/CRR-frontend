import { Link } from "react-router-dom";
import styles from "./Header.module.scss";

export default function Header() {
  return (
    <header className={styles.header}>
      <nav>
        trzeba zmienic linki i dodac style
        <ul>
          <li>
            <Link to="/page-one">Page One</Link>
          </li>
          <li>
            <Link to="/page-two">Page Two</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
