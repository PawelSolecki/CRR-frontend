import { zUserCv } from "@api/career-service/zod.gen";
import { ContentSwitcher, CvInputSection } from "@/features/cv-upload";
import { CV_STORAGE_KEY } from "@shared/hooks/useCvData";
import { useState } from "react";
import { redirect } from "react-router-dom";
import styles from "./PageOne.module.scss";

export default function PageOne() {
  const [activeTab, setActiveTab] = useState<any>("upload");

  return (
    <div className={styles.pageOne}>
      <ContentSwitcher activeTab={activeTab} onTabChange={setActiveTab} />
      <CvInputSection activeTab={activeTab} />
    </div>
  );
}

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const cvDataString = formData.get("cvData") as string;

  if (!cvDataString) {
    // Handle case where there's no data, maybe from the manual form
    // This part will need to be built out to handle the multi-field form
    console.error("No cvData field in form submission");
    // For now, we'll just handle the JSON upload case
    return { ok: false, error: "No data submitted" };
  }

  try {
    const cvData = JSON.parse(cvDataString);
    const validation = zUserCv.safeParse(cvData);

    if (validation.success) {
      window.localStorage.setItem(
        CV_STORAGE_KEY,
        JSON.stringify(validation.data)
      );
      return redirect("/enhance-tags");
    } else {
      console.error("Invalid CV data submitted:", validation.error);
      return { ok: false, error: "Invalid data format" };
    }
  } catch (error) {
    console.error("Error processing submitted CV data:", error);
    return { ok: false, error: "Failed to process data" };
  }
}
