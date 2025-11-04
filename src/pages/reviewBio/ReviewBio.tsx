import {
  postApiV1CvGenerateBio,
  type JobOffer,
  type SkillResult,
} from "@api/career-ai-service";
import type { UserCv } from "@api/career-service";
import ReviewBioForm from "@features/reviewBio/ReviewBioForm";
import Error from "@shared/components/Error/Error";
import { CV_STORAGE_KEY } from "@shared/hooks/useCvData";
import { useJobOfferStore } from "@shared/hooks/useJobOfferStore";
import { useEffect, useState } from "react";
import { redirect, useActionData } from "react-router-dom";
import classes from "./ReviewBio.module.scss";

interface ActionData {
  success?: boolean;
  error?: string;
}

export default function ReviewBio() {
  const actionData = useActionData() as ActionData;
  const { jobOffer, skillResult } = useJobOfferStore();

  const [isLoading, setIsLoading] = useState(true);
  const [generatedBio, setGeneratedBio] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generateBio = async () => {
      const data = window.localStorage.getItem(CV_STORAGE_KEY);
      if (data) {
        const cvData = JSON.parse(data) as UserCv;
        if (cvData.personalInfo.summary) {
          setGeneratedBio(cvData.personalInfo.summary);
          setIsLoading(false);
          return;
        }
      }
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

      generateBioData(jobOffer, skillResult);
    };

    const generateBioData = async (
      jobOfferData: JobOffer,
      skillResultData: SkillResult,
    ) => {
      try {
        const data = window.localStorage.getItem(CV_STORAGE_KEY);
        if (!data) {
          setError("CV data is missing. Please complete your CV first.");
          setIsLoading(false);
          return;
        }

        const response = await postApiV1CvGenerateBio({
          body: {
            userCV: JSON.parse(data),
            jobOffer: jobOfferData,
            skillResult: skillResultData,
          },
        });

        if (response.response.status !== 200 || !response.data) {
          setError("Failed to generate bio. Please try again later.");
          setIsLoading(false);
          return;
        }

        setGeneratedBio(response.data.bio || "");
        setIsLoading(false);
      } catch {
        setError("An unexpected error occurred. Please try again later.");
        setIsLoading(false);
      }
    };

    generateBio();
  }, [jobOffer, skillResult]);

  return (
    <div className={classes.container}>
      <div className={classes.content}>
        <h1 className={classes.title}>Review Your Professional Bio</h1>
        <p className={classes.subtitle}>
          Review and edit your AI-generated professional summary
        </p>
        {actionData?.error && <Error message={actionData.error} />}
        {error && <Error message={error} />}
        {isLoading ? (
          <div className={classes.loadingContainer}>
            <div className={classes.loadingSpinner}></div>
            <p className={classes.loadingText}>
              Generating your professional summary...
            <p className={classes.loadingText}>
              It can take couple of minutes, please be patient.
            </p>
          </div>
        ) : (
          <ReviewBioForm generatedBio={generatedBio} />
        )}
      </div>
    </div>
  );
}

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const enhancedBio = formData.get("enhancedBio");

  if (enhancedBio) {
    const data = window.localStorage.getItem(CV_STORAGE_KEY);
    if (!data) {
      return { error: "CV data is missing. Please complete your CV first." };
    }
    const cvData = JSON.parse(data) as UserCv;
    cvData.personalInfo.summary = enhancedBio as string;
    window.localStorage.setItem(CV_STORAGE_KEY, JSON.stringify(cvData));

    return redirect("/review-cv");
  }

  return { success: false, error: "No enhanced bio provided" };
}
