import { Outlet } from "react-router-dom";
import styles from "./LandingLayout.module.scss";

export default function LandingLayout() {
  return (
    <div className={styles.landingLayout}>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
