import { useState } from "react";
import BulletPointEditor from "./BulletPointEditor";
import styles from "./EntryEditor.module.scss";
import type { BulletPoint } from "../types";

interface EntryEditorProps {
  title: string;
  subtitle?: string;
  meta?: string;
  link?: {
    href: string;
    label?: string;
  };
  bulletPoints?: BulletPoint[] | null;
  emptyMessage: string;
  onAddTechnology: (bulletIndex: number, technology: string) => void;
  onRemoveTechnology: (bulletIndex: number, technology: string) => void;
}

export default function EntryEditor({
  title,
  subtitle,
  meta,
  link,
  bulletPoints,
  emptyMessage,
  onAddTechnology,
  onRemoveTechnology,
}: EntryEditorProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const points = bulletPoints ?? [];

  const toggleExpanded = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div className={styles.entryEditor}>
      <div
        className={styles.header}
        onClick={toggleExpanded}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            toggleExpanded();
          }
        }}
      >
        <div className={styles.headerContent}>
          <div className={styles.primaryLine}>
            <span className={styles.title}>{title}</span>
            {subtitle && (
              <>
                <span className={styles.separator}>•</span>
                <span className={styles.subtitle}>{subtitle}</span>
              </>
            )}
          </div>
          {link && (
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
              onClick={(event) => event.stopPropagation()}
            >
              {link.label ?? link.href}
            </a>
          )}
          {meta && <div className={styles.meta}>{meta}</div>}
        </div>
        <div className={styles.expandIcon}>{isExpanded ? "−" : "+"}</div>
      </div>

      {isExpanded && (
        <div className={styles.content}>
          <div className={styles.bulletPoints}>
            {points.length > 0 ? (
              points.map((bulletPoint, index) => (
                <BulletPointEditor
                  key={index}
                  bulletPoint={bulletPoint}
                  onAddTechnology={(technology) =>
                    onAddTechnology(index, technology)
                  }
                  onRemoveTechnology={(technology) =>
                    onRemoveTechnology(index, technology)
                  }
                />
              ))
            ) : (
              <div className={styles.emptyState}>{emptyMessage}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
