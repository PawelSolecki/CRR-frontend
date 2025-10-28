import { redirect, useActionData } from "react-router-dom";
import { scrape } from "../../api/career-service";
import JobOfferForm from "../../features/JobOffer/JobOfferForm";
import classes from "./JobOffer.module.scss";

export default function JobOffer() {
  const actionData = useActionData() as { error?: string } | undefined;

  return (
    <div className={classes.container}>
      <div className={classes.content}>
        <h1 className={classes.title}>Job Offer URL</h1>
        <p className={classes.subtitle}>Paste the link to the job offer</p>

        {actionData?.error && (
          <div className={classes.error}>{actionData.error}</div>
        )}

        <JobOfferForm />
      </div>
    </div>
  );
}

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const jobUrl = formData.get("jobUrl") as string;

  try {
    const response = await scrape({
      query: { url: jobUrl },
    });
    if (response.response.status !== 200) {
      return {
        error:
          "Failed to scrape job offer. Please check the URL and try again.",
      };
    }
    return redirect("/review-bio");
  } catch {
    return {
      error: "Failed to scrape job offer. Please check the URL and try again.",
    };
  }
}
