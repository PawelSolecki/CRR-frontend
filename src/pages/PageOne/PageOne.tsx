import styles from "./PageOne.module.scss";
import { useState } from "react";
import { ContentSwitcher, CvInputSection } from "../../features/cv-upload";

export default function PageOne() {
  const [activeTab, setActiveTab] = useState<ContentType>("upload");

  return (
    <div className={styles.pageOne}>
      <ContentSwitcher activeTab={activeTab} onTabChange={setActiveTab} />
      <CvInputSection activeTab={activeTab} />
    </div>
  );
}
