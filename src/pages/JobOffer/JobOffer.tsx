import { Form, useNavigation } from "react-router-dom";
import Button from "../../components/ui/Button/Button";
import Input from "../../components/ui/Input/Input";
import { useInput } from "../../hooks/useInput";
import classes from "./JobOffer.module.scss";

export default function JobOffer() {
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (jobUrlInput.hasError || !jobUrlInput.value.trim()) {
      e.preventDefault();
      jobUrlInput.handleInputBlur();
      return;
    }
  };

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className={classes.container}>
      <div className={classes.content}>
        <h1 className={classes.title}>Job Offer URL</h1>
        <p className={classes.subtitle}>Paste the link to the job offer</p>

        <Form method="post" onSubmit={handleSubmit}>
          <input type="hidden" name="jobUrl" value="" />

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
                  error={jobUrlInput.hasError ? "Please enter a valid URL" : ""}
                  inputProps={{
                    disabled: isLoading,
                  }}
                />
              </div>
            </div>
          </div>

          <div className={classes.navigation}>
            <Button type="secondary" onClick={handleBack} disabled={isLoading}>
              Back
            </Button>
            <Button
              type="primary"
              disabled={
                isLoading || jobUrlInput.hasError || !jobUrlInput.value.trim()
              }
            >
              {isLoading ? "Scraping job offer..." : "Next"}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
