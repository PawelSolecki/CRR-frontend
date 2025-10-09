import { Outlet } from "react-router-dom";
import Header from "../../components/Header";
import styles from "./MainLayout.module.scss";

export default function MainLayout() {
  return (
    <div className={styles.mainLayout}>
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
