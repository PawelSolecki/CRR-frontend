import Button from "@/shared/components/Button/Button";
import Error from "@/shared/components/Error/Error";
import Icon from "@/shared/components/Icon/Icon";
import { useEffect, useState } from "react";
import { Form, useActionData, useNavigation } from "react-router-dom";
import { prepareCv } from "../../api/career-service/sdk.gen";
import type { SkillResult, UserCv } from "../../api/career-service/types.gen";
import { CV_STORAGE_KEY } from "../../shared/hooks/useCvData";
import { useJobOfferStore } from "../../shared/hooks/useJobOfferStore";
import { FormNavigation } from "../navigation";
import classes from "./DownloadForm.module.scss";

interface ActionData {
  success?: boolean;
  error?: string;
  pdfUrl?: string;
  fileName?: string;
}

export default function DownloadForm() {
  const actionData = useActionData() as ActionData;
  const navigation = useNavigation();
  const { jobOffer, skillResult } = useJobOfferStore();

  const [isLoading, setIsLoading] = useState(true);
  const [enhancedCv, setEnhancedCv] = useState<UserCv | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const prepareCV = async () => {
      if (!jobOffer) {
        setError("Job offer data is missing. Please add a job offer first.");
        setIsLoading(false);
        return;
      }
      if (!skillResult) {
        setError(
          "Skill analysis data is missing. Please analyze the job offer first.",
        );
        setIsLoading(false);
        return;
      }

      prepareCVData(skillResult);
    };

    const prepareCVData = async (skillResultData: SkillResult) => {
      try {
        const data = window.localStorage.getItem(CV_STORAGE_KEY);
        if (!data) {
          setError("CV data is missing. Please complete your CV first.");
          setIsLoading(false);
          return;
        }

        const userCv = JSON.parse(data) as UserCv;

        const response = await prepareCv({
          body: {
            userCV: userCv,
            skillResult: skillResultData,
          },
        });

        if (!response.data) {
          setError("Failed to prepare CV. Please try again later.");
          setIsLoading(false);
          return;
        }
        console.log("Prepared CV response:", response.data);
        // Store the enhanced CV back to localStorage
        const prepared = response.data;
        window.localStorage.setItem(CV_STORAGE_KEY, JSON.stringify(prepared));
        setEnhancedCv(prepared);
        setIsLoading(false);
      } catch {
        setError("An unexpected error occurred. Please try again later.");
        setIsLoading(false);
      }
    };

    prepareCV();
  }, [jobOffer, skillResult]);

  const handleDownload = () => {
    if (!actionData?.pdfUrl) return;

    const link = document.createElement("a");
    link.href = actionData.pdfUrl;
    link.download = actionData.fileName || "CV.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBack = () => {
    window.history.back();
  };

  const isSubmitting = navigation.state === "submitting";
  const isGenerating = navigation.formData?.get("action") === "generate-pdf";
  const hasGeneratedPdf = actionData?.success && actionData?.pdfUrl;

  if (error) {
    return (
      <>
        <div className={classes.successCard}>
          <Error message={error} />
        </div>
        <FormNavigation
          onBack={handleBack}
          isLoading={false}
          nextDisabled={true}
          nextText="Retry"
        />
      </>
    );
  }

  if (isLoading) {
    return (
      <div className={classes.successCard}>
        <div className={classes.checkIcon}>
          <div className={classes.loadingSpinner}></div>
        </div>
        <h1 className={classes.title}>Preparing Your CV</h1>
        <p className={classes.description}>
          Enhancing your CV with skills tailored to the job offer...
        </p>
      </div>
    );
  }

  return (
    <>
      <div className={classes.successCard}>
        <div className={classes.checkIcon}>
          <Icon iconName="check" size={48} />
        </div>

        <h1 className={classes.title}>
          {hasGeneratedPdf ? "Your CV is Ready!" : "Generate Your CV"}
        </h1>

        <p className={classes.description}>
          {hasGeneratedPdf
            ? "Your customized CV has been generated successfully. Click the button below to download it as a PDF."
            : "Your CV has been enhanced with skills tailored to the job offer. Click the button below to generate your PDF."}
        </p>

        {!hasGeneratedPdf ? (
          <Form method="post">
            <input type="hidden" name="action" value="generate-pdf" />
            <Button
              type="primary"
              text={isGenerating ? "Generating PDF..." : "Generate CV PDF"}
              buttonType="submit"
              disabled={isSubmitting}
              styles={{ marginBottom: "1.5rem" }}
            />
          </Form>
        ) : (
          <Button
            type="primary"
            text="Download CV as PDF"
            onClick={handleDownload}
            disabled={isSubmitting}
            styles={{ marginBottom: "1.5rem" }}
          />
        )}

        <Form method="post">
          <input type="hidden" name="action" value="restart" />
          <div className={classes.actionButtons}>
            <Button
              type="secondary"
              text="Go to Homepage"
              buttonType="submit"
              disabled={isSubmitting}
              styles={{ marginBottom: "1rem" }}
            />
          </div>
        </Form>

        <p className={classes.additionalInfo}>
          You can also go back to make any final adjustments before generating
          your CV.
        </p>
      </div>
      <Form method="post">
        <input type="hidden" name="action" value="restart" />
        <FormNavigation
          onBack={handleBack}
          isLoading={isSubmitting}
          nextDisabled={isSubmitting || !hasGeneratedPdf}
          nextText="Finish"
          nextButtonType="submit"
        />
      </Form>
    </>
  );
}
