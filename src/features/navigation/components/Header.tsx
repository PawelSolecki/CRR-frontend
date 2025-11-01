import { Link } from "react-router-dom";
import type { HeaderProps } from "../types";
import { getStepClass } from "../utils/stepUtils";
import styles from "./Header.module.scss";

export default function Header({ steps, currentStep }: HeaderProps) {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <div className={styles.stepsContainer}>
          {steps.map((step) => (
            <div key={step.id} className={styles.stepWrapper}>
              <Link
                to={step.link}
                className={`${styles.step} ${
                  styles[getStepClass(step.id, currentStep)]
                }`}
              >
                <div className={styles.stepNumber}>{step.id}</div>
                <div className={styles.stepTitle}>{step.title}</div>
              </Link>
            </div>
          ))}
        </div>
      </nav>
    </header>
  );
}
