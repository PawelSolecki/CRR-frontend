import { Form, useNavigation } from "react-router-dom";
import Input from "../../components/ui/Input/Input";
import { useInput } from "../../hooks/useInput";
import { FormNavigation } from "../navigation";
import classes from "./JobOfferForm.module.scss";

export default function JobOfferForm() {
  const navigation = useNavigation();
  const isLoading = navigation.state === "submitting";

  const jobUrlInput = useInput("", (value) => {
    if (!value.trim()) return false;
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  });

  return (
    <Form method="post" noValidate className={classes.form}>
      <input type="hidden" name="jobUrl" value={jobUrlInput.value} />

      <div className={classes.formSection}>
        <div className={classes.formContainer}>
          <div className={classes.inputSection}>
            <Input
              id="jobUrl"
              type="text"
              label="Job Offer URL"
              placeholder="https://example.com/job-posting"
              value={jobUrlInput.value}
              onChange={jobUrlInput.handleInputChange}
              onBlur={jobUrlInput.handleInputBlur}
              error={jobUrlInput.hasError ? "Please enter a valid URL" : false}
              disabled={isLoading}
              style={{ width: "100%" }}
            />
          </div>
        </div>
      </div>

      <FormNavigation
        nextButtonType="submit"
        nextText={isLoading ? "Scraping job offer..." : "Next"}
        nextDisabled={jobUrlInput.hasError || !jobUrlInput.value.trim()}
        isLoading={isLoading}
      />
    </Form>
  );
}
