import { redirect, useActionData } from "react-router-dom";
import ReviewCVForm from "../../features/ReviewCV/ReviewCVForm";
import classes from "./ReviewCV.module.scss";

interface ActionData {
  success: boolean;
  error?: string;
}

export default function ReviewCV() {
  const actionData = useActionData() as ActionData | undefined;

  return (
    <div className={classes.container}>
      <div className={classes.content}>
        <h1 className={classes.title}>Review Your CV</h1>
        <p className={classes.subtitle}>
          Review and verify all sections of your CV. You can edit education,
          certifications, and other details below.
        </p>

        {actionData?.error && (
          <div className={classes.error}>{actionData.error}</div>
        )}
        {/*implement loader in form*/}
        <ReviewCVForm cvData={{}} />
      </div>
    </div>
  );
}

//TODO: implement loader

// TODO: Integrate with backend
export async function action({ request }: { request: Request }) {
  try {
    const formData = await request.formData();
    const cvData = formData.get("cvData") as string;

    if (cvData) {
      return redirect("/generate-pdf");
    }

    return { success: false, error: "No CV data provided" };
  } catch (error) {
    console.error("Error processing CV review:", error);
    return {
      success: false,
      error: "Failed to process CV review. Please try again.",
    };
  }
}
