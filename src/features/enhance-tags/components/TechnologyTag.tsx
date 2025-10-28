import styles from "./TechnologyTag.module.scss";

interface TechnologyTagProps {
  technology: string;
  onRemove: () => void;
}

export default function TechnologyTag({
  technology,
  onRemove,
}: TechnologyTagProps) {
  return (
    <span className={styles.technologyTag}>
      {technology}
      <button
        className={styles.removeButton}
        onClick={onRemove}
        aria-label={`Usuń ${technology}`}
        type="button"
      >
        ✕
      </button>
    </span>
  );
}
