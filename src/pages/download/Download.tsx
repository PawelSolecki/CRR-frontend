import { generatePdf } from "@api/career-service/sdk.gen";
import type { UserCv } from "@api/career-service/types.gen";
import DownloadForm from "@features/download/DownloadForm";
import Error from "@shared/components/Error/Error";
import { CV_STORAGE_KEY } from "@shared/hooks/useCvData";
import { useJobOfferStore } from "@shared/hooks/useJobOfferStore";
import { useTemplateStore } from "@shared/hooks/useTemplateStore";
import { redirect, useActionData } from "react-router-dom";
import classes from "./Download.module.scss";

interface ActionData {
  success?: boolean;
  error?: string;
  pdfUrl?: string;
  fileName?: string;
}

export default function Download() {
  const actionData = useActionData() as ActionData;

  return (
    <div className={classes.container}>
      <div className={classes.content}>
        {actionData?.error && <Error message={actionData.error} />}
        <DownloadForm />
      </div>
    </div>
  );
}

// Action - handle PDF generation and other actions
export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const actionType = formData.get("action");

  if (actionType === "generate-pdf") {
    try {
      const cvData = window.localStorage.getItem(CV_STORAGE_KEY);
      const { selectedTemplate, selectedLanguage } =
        useTemplateStore.getState();

      if (!cvData || !selectedTemplate || !selectedLanguage) {
        return {
          success: false,
          error: "Missing required data for PDF generation",
        };
      }

      const enhancedCv = JSON.parse(cvData) as UserCv;

      const pdfResult = await generatePdf({
        body: {
          userCV: enhancedCv,
          template: selectedTemplate,
          language: selectedLanguage,
        },
      });

      console.log("PDF Generation Result:", pdfResult);

      // Extract filename from Content-Disposition header
      let fileName = "CV.pdf"; // Default fallback
      if (pdfResult.response && pdfResult.response.headers) {
        const contentDisposition = pdfResult.response.headers.get(
          "content-disposition",
        );
        if (contentDisposition) {
          // Parse filename from header like: attachment; filename="John_Doe_CV.pdf"
          const filenameMatch = contentDisposition.match(
            /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/,
          );
          if (filenameMatch && filenameMatch[1]) {
            fileName = filenameMatch[1].replace(/['"]/g, ""); // Remove quotes
          }
        }
      }

      // Create blob from the binary PDF data
      const blob = new Blob([pdfResult.data as ArrayBuffer], {
        type: "application/pdf",
      });
      const pdfUrl = URL.createObjectURL(blob);

      return { success: true, pdfUrl, fileName };
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      return {
        success: false,
        error: "Failed to generate PDF. Please try again.",
      };
    }
  }

  if (actionType === "restart") {
    // Clear stores and redirect to start
    useJobOfferStore.getState().clearJobOffer();
    useJobOfferStore.getState().clearSkillResult();
    useTemplateStore.getState().clearSelection();
    window.localStorage.removeItem(CV_STORAGE_KEY);
    return redirect("/");
  }

  return { success: false, error: "Unknown action" };
}
