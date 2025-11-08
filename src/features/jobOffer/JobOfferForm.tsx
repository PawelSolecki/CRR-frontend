import { FormNavigation } from "@/features/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@shared/components/Input/Input";
import { useJobOfferStore } from "@shared/hooks/useJobOfferStore";
import { useForm } from "react-hook-form";
import { Form, useNavigation } from "react-router-dom";
import { z } from "zod";
import classes from "./JobOfferForm.module.scss";

const jobOfferSchema = z.object({
  jobUrl: z.url("Please enter a valid URL"),
});

type JobOfferFormData = z.infer<typeof jobOfferSchema>;

export default function JobOfferForm() {
  const navigation = useNavigation();
  const isLoading = navigation.state === "submitting";
  const { jobOffer } = useJobOfferStore();

  const {
    register,
    watch,
    formState: { errors },
  } = useForm<JobOfferFormData>({
    resolver: zodResolver(jobOfferSchema),
    mode: "onBlur",
    defaultValues: {
      jobUrl: jobOffer ? jobOffer.url : "",
    },
  });
  const jobUrlValue = watch("jobUrl");
  return (
    <Form method="post" className={classes.form}>
      <div className={classes.formSection}>
        <div className={classes.formContainer}>
          <div className={classes.inputSection}>
            <Input
              id="jobUrl"
              type="text"
              label="Job Offer URL"
              placeholder="https://example.com/job-posting"
              error={errors.jobUrl?.message}
              disabled={isLoading}
              style={{ width: "100%" }}
              {...register("jobUrl")}
            />
          </div>
        </div>
      </div>

      <FormNavigation
        nextButtonType="submit"
        nextText={isLoading ? "Scraping job offer..." : "Next"}
        nextDisabled={isLoading || !!errors.jobUrl || !jobUrlValue?.trim()}
        isLoading={isLoading}
      />
    </Form>
  );
}
