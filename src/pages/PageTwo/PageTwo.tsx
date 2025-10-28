import { useLoaderData, useNavigate } from "react-router-dom";
import styles from "./PageTwo.module.scss";
import { postApiV1CvAnalyzeCv } from "../../api/career-ai-service";
import { CV_STORAGE_KEY } from "../../shared/hooks/useCvData";
import type { PostApiV1CvAnalyzeCvResponse } from "../../api/career-ai-service";
import { TagsEditor } from "../../features/enhance-tags";
import { convertAnalyzedCvToUserCv } from "../../features/enhance-tags/utils";
import type { AnalyzedCvData } from "../../features/enhance-tags";

export default function PageTwo() {
  const navigate = useNavigate();
  const { data, error } = useLoaderData() as {
    data: PostApiV1CvAnalyzeCvResponse | null;
    error: string | null;
  };

  const handleSave = (updatedCvData: AnalyzedCvData) => {
    // Konwertuj i zapisz zaktualizowane dane do localStorage
    try {
      const userCvData = convertAnalyzedCvToUserCv(updatedCvData);
      window.localStorage.setItem(CV_STORAGE_KEY, JSON.stringify(userCvData));
      console.log("Dane CV zaktualizowane z nowymi technologiami");
      // Możesz tutaj nawigować do następnej strony
      // navigate("/next-page");
    } catch (error) {
      console.error("Błąd podczas zapisywania danych:", error);
    }
  };

  const handleCancel = () => {
    navigate("/upload-cv");
  };

  if (error) {
    return (
      <div className={styles.pageTwo}>
        <div className={styles.error}>
          <h1>Błąd</h1>
          <p>{error}</p>
          <button onClick={() => navigate("/upload-cv")}>
            Wróć do poprzedniej strony
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={styles.pageTwo}>
        <div className={styles.loading}>Ładowanie danych...</div>
      </div>
    );
  }

  return (
    <div className={styles.pageTwo}>
      <TagsEditor cvData={data} onSave={handleSave} onCancel={handleCancel} />
    </div>
  );
}

export async function loader() {
  try {
    const cvDataString = window.localStorage.getItem(CV_STORAGE_KEY);
    if (!cvDataString) {
      throw new Error("Brak danych CV w localStorage");
    }

    const cvData = JSON.parse(cvDataString);
    cvData.personalInfo.summary = "";
    cvData.personalInfo.other = "";
    cvData.experience[0].url = "";

    const response = await postApiV1CvAnalyzeCv({
      body: cvData,
    });

    return { data: response.data, error: null };
  } catch (error) {
    console.error("Błąd podczas analizy CV:", error);
    return {
      data: null,
      error:
        error instanceof Error
          ? error.message
          : "Wystąpił błąd podczas analizy CV",
    };
  }
}
