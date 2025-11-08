import styles from "./ContentSwitcher.module.scss";

export type ContentType = "upload" | "manual";

interface ContentSwitcherProps {
  activeTab: ContentType;
  onTabChange: (tab: ContentType) => void;
}

export default function ContentSwitcher({
  activeTab,
  onTabChange,
}: ContentSwitcherProps) {
  return (
    <div className={styles.switcher}>
      <button
        className={`${styles.tab} ${
          activeTab === "upload" ? styles.active : ""
        }`}
        onClick={() => onTabChange("upload")}
      >
        Upload JSON
      </button>
      <button
        className={`${styles.tab} ${
          activeTab === "manual" ? styles.active : ""
        }`}
        onClick={() => onTabChange("manual")}
      >
        Manual Entry
      </button>
    </div>
  );
}
