import { redirect, useActionData, useLoaderData } from "react-router-dom";
import { postApiV1CvGenerateBio } from "../../api/career-ai-service";
import type { UserCv } from "../../api/career-service";
import Error from "../../components/ui/Error/Error";
import ReviewBioForm from "../../features/ReviewBio/ReviewBioForm";
import { CV_STORAGE_KEY } from "../../shared/hooks/useCvData";
import { useJobOfferStore } from "../../shared/hooks/useJobOfferStore";
import classes from "./ReviewBio.module.scss";

interface ActionData {
  success?: boolean;
  error?: string;
}

interface LoaderData {
  error?: string;
}

export default function ReviewBio() {
  const loaderData = useLoaderData() as LoaderData;
  const actionData = useActionData() as ActionData;

  return (
    <div className={classes.container}>
      <div className={classes.content}>
        <h1 className={classes.title}>Review Your Professional Bio</h1>
        <p className={classes.subtitle}>
          Review and edit your AI-generated professional summary
        </p>
        {actionData?.error && <Error message={actionData.error} />}
        {loaderData?.error && <Error message={loaderData.error} />}
        <ReviewBioForm />
      </div>
    </div>
  );
}

export async function loader() {
  const { jobOffer, skillResult } = useJobOfferStore.getState();
  if (!jobOffer || !skillResult) {
    return {
      error: "Job offer data is missing. Please add a job offer first.",
    };
  }
  try {
    const data = window.localStorage.getItem(CV_STORAGE_KEY);
    if (!data) {
      return { error: "CV data is missing. Please complete your CV first." };
    }
    const response = await postApiV1CvGenerateBio({
      body: {
        userCV: data ? JSON.parse(data) : {},
        jobOffer: jobOffer || {},
        skillResult: skillResult || {},
      },
    });
    if (response.response.status !== 200 || !response.data) {
      return { error: "Failed to generate bio. Please try again later." };
    }
    return response.data;
  } catch {
    return { error: "An unexpected error occurred. Please try again later." };
  }
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

    return redirect("/app/review-cv");
  }

  return { success: false, error: "No enhanced bio provided" };
}
