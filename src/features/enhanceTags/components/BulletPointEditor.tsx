import { useState } from "react";
import TechnologyTag from "./TechnologyTag";
import AddTechnologyInput from "./AddTechnologyInput";
import styles from "./BulletPointEditor.module.scss";
import type { BulletPoint } from "../types";

interface BulletPointEditorProps {
  bulletPoint: BulletPoint;
  onAddTechnology: (technology: string) => void;
  onRemoveTechnology: (technology: string) => void;
}

export default function BulletPointEditor({
  bulletPoint,
  onAddTechnology,
  onRemoveTechnology,
}: BulletPointEditorProps) {
  const [showAddInput, setShowAddInput] = useState(false);

  const handleRemoveTechnology = (technology: string) => {
    if (!bulletPoint.technologies?.includes(technology)) {
      return;
    }
    onRemoveTechnology(technology);
  };

  const handleAddTechnology = (technology: string) => {
    const trimmed = technology.trim();
    if (!trimmed) {
      return;
    }
    if (bulletPoint.technologies?.includes(trimmed)) {
      setShowAddInput(false);
      return;
    }
    onAddTechnology(trimmed);
    setShowAddInput(false);
  };

  return (
    <div className={styles.bulletPointEditor}>
      <div className={styles.bulletText}>• {bulletPoint.text || ""}</div>
      <div className={styles.technologiesList}>
        {bulletPoint.technologies?.map((tech, index) => (
          <TechnologyTag
            key={`${tech}-${index}`}
            technology={tech}
            onRemove={() => handleRemoveTechnology(tech)}
          />
        ))}
        {showAddInput ? (
          <AddTechnologyInput onAdd={handleAddTechnology} />
        ) : (
          <button
            type="button"
            onClick={() => setShowAddInput(true)}
            className={styles.addButton}
          >
            + Add
          </button>
        )}
      </div>
    </div>
  );
}
