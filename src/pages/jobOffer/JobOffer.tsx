import { postApiV1OfferAnalyzeOffer } from "@api/career-ai-service";
import { scrape } from "@api/career-service";
import JobOfferForm from "@features/jobOffer/JobOfferForm";
import Error from "@shared/components/Error/Error";
import { useJobOfferStore } from "@shared/hooks/useJobOfferStore";
import { redirect, useActionData } from "react-router-dom";
import classes from "./JobOffer.module.scss";

export default function JobOffer() {
  const actionData = useActionData() as { error?: string } | undefined;

  return (
    <div className={classes.container}>
      <div className={classes.content}>
        <h1 className={classes.title}>Job Offer URL</h1>
        <p className={classes.subtitle}>Paste the link to the job offer</p>
        {actionData?.error && <Error message={actionData.error} />}
        <JobOfferForm />
      </div>
    </div>
  );
}

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const jobUrl = formData.get("jobUrl") as string;
  const { setJobOfferUrl, setJobOffer, setSkillResult } =
    useJobOfferStore.getState();
  try {
    // Before making API calls, store the job URL
    setJobOfferUrl(jobUrl);
    // First API call: scrape job offer
    const response = await scrape({
      query: { url: jobUrl },
    });

    if (response.response.status !== 200 || !response.data) {
      return {
        error:
          "Failed to scrape job offer. Please check the URL and try again.",
      };
    }
    // Store the job offer data
    setJobOffer(response.data);

    // Second API call: analyze job offer for skills
    const secondResponse = await postApiV1OfferAnalyzeOffer({
      body: {
        description: response.data.description,
        technologies: response.data.technologies,
        requirements: response.data.requirements,
        responsibilities: response.data.responsibilities,
      },
    });

    if (secondResponse.response.status !== 200 || !secondResponse.data) {
      return { error: "Failed to analyze job offer. Please try again later." };
    }

    // Store the skill analysis result
    setSkillResult(secondResponse.data);

    return redirect("/review-bio");
  } catch {
    return {
      error: "Failed to scrape job offer. Please check the URL and try again.",
    };
  }
}
