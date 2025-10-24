import { redirect, useActionData } from "react-router-dom";
import ReviewBioForm from "../../features/ReviewBio/ReviewBioForm";
import classes from "./ReviewBio.module.scss";

interface ActionData {
  success: boolean;
  error?: string;
}

export default function ReviewBio() {
  const actionData = useActionData() as ActionData;

  return (
    <div className={classes.container}>
      <div className={classes.content}>
        <h1 className={classes.title}>Review Your Professional Bio</h1>
        <p className={classes.subtitle}>
          Review and edit your AI-generated professional summary
        </p>

        <ReviewBioForm />

        {actionData?.error && (
          <div className={classes.error}>{actionData.error}</div>
        )}
      </div>
    </div>
  );
}

export async function loader() {
  // TODO: Implement logic when hook is ready
  return {
    generatedBio: "",
  };
}

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const enhancedBio = formData.get("enhancedBio");

  if (enhancedBio) {
    return redirect("/app/review-cv");
  }

  return { success: false, error: "No enhanced bio provided" };
}
