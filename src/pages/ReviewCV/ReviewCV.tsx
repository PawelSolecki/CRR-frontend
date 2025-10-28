import { redirect, useActionData, useLoaderData } from "react-router-dom";
import type { UserCv } from "../../api/career-service";
import Error from "../../components/ui/Error/Error";
import ReviewCVForm from "../../features/ReviewCV/ReviewCVForm";
import { CV_STORAGE_KEY } from "../../shared/hooks/useCvData";
import classes from "./ReviewCV.module.scss";

interface ActionData {
  success: boolean;
  error?: string;
}

interface LoaderData {
  userCv: UserCv;
  error?: string;
}

export default function ReviewCV() {
  const actionData = useActionData() as ActionData;
  const loaderData = useLoaderData() as LoaderData;

  return (
    <div className={classes.container}>
      <div className={classes.content}>
        <h1 className={classes.title}>Review Your CV</h1>
        <p className={classes.subtitle}>
          Review and verify all sections of your CV. You can edit education,
          certifications, and other details below.
        </p>
        {loaderData?.error && <Error message={loaderData.error} />}
        {actionData?.error && <Error message={actionData.error} />}
        <ReviewCVForm userCv={loaderData.userCv} />
      </div>
    </div>
  );
}

export async function loader() {
  try {
    const data = window.localStorage.getItem(CV_STORAGE_KEY);
    if (!data) {
      return { error: "CV data is missing. Please complete your CV first." };
    }
    return { userCv: JSON.parse(data) };
  } catch {
    return { error: "Failed to load CV data. Please try again later." };
  }
}

export async function action() {
  return redirect("/choose-template");
}
