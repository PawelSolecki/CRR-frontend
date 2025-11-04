import type { UserCv } from "@api/career-service/types.gen";
import ChooseTemplateForm from "@features/chooseTemplate/ChooseTemplateForm";
import Error from "@shared/components/Error/Error";
import { CV_STORAGE_KEY } from "@shared/hooks/useCvData";
import { useJobOfferStore } from "@shared/hooks/useJobOfferStore";
import { useTemplateStore } from "@shared/hooks/useTemplateStore";
import { redirect, useActionData } from "react-router-dom";
import classes from "./ChooseTemplate.module.scss";

interface ActionData {
  success?: boolean;
  error?: string;
}

// Loader
export async function loader() {
  const cvData = window.localStorage.getItem(CV_STORAGE_KEY);
  const { jobOffer, skillResult } = useJobOfferStore.getState();

  if (!cvData) {
    throw new Response("CV data is missing. Please complete your CV first.", {
      status: 404,
    });
  }

  if (!jobOffer || !skillResult) {
    throw new Response(
      "Job offer data is missing. Please complete the job offer analysis first.",
      { status: 404 },
    );
  }

  try {
    const userCv = JSON.parse(cvData) as UserCv;
    return { userCv, jobOffer, skillResult };
  } catch {
    throw new Response("Invalid CV data format.", { status: 400 });
  }
}

// Action
export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const template = formData.get("template") as TemplateType;
  const language = formData.get("language") as LanguageType;

  if (!template || !language) {
    return {
      success: false,
      error: "Please select both a template and language before proceeding.",
    };
  }

  // Store the selection
  useTemplateStore.getState().setTemplateSelection(template, language);

  return redirect("/download");
}

export default function ChooseTemplate() {
  const actionData = useActionData() as ActionData;
  return (
    <div className={classes.container}>
      <div className={classes.content}>
        <h1 className={classes.title}>Choose Language & Template</h1>
        <p className={classes.subtitle}>
          Select your preferred language and CV template to generate your
          personalized CV
        </p>

        {actionData?.error && <Error message={actionData.error} />}

        <ChooseTemplateForm />
      </div>
    </div>
  );
}
