import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, useSubmit } from "react-router-dom";
import { zUserCv } from "../../../api/career-service/zod.gen";
import { useCvData } from "../../../shared/hooks/useCvData";
import PersonalInfoSection from "./form-sections/PersonalInfoSection";
import SkillsLanguagesCertsSection from "./form-sections/SkillsLanguagesCertsSection";
import ExperienceSection from "./form-sections/ExperienceSection";
import EducationSection from "./form-sections/EducationSection";
import ProjectsSection from "./form-sections/ProjectsSection";
import styles from "./CvForm.module.scss";

type UserCvForm = z.infer<typeof zUserCv>;

const FormStep = {
  PERSONAL_INFO: 0,
  SKILLS_LANGUAGES_CERTS: 1,
  EDUCATION: 2,
  EXPERIENCE: 3,
  PROJECTS: 4,
} as const;

type FormStep = (typeof FormStep)[keyof typeof FormStep];

const STEP_TITLES = {
  [FormStep.PERSONAL_INFO]: "Personal Information",
  [FormStep.SKILLS_LANGUAGES_CERTS]: "Skills, Languages & Certifications",
  [FormStep.EXPERIENCE]: "Work Experience",
  [FormStep.EDUCATION]: "Education",
  [FormStep.PROJECTS]: "Projects",
};

export default function CvForm() {
  const { cvData, updateCvData } = useCvData();
  const [currentStep, setCurrentStep] = useState<FormStep>(
    FormStep.PERSONAL_INFO
  );
  const submit = useSubmit();

  const {
    register,
    control,
    getValues,
    formState: { errors },
    trigger,
    reset,
  } = useForm<UserCvForm>({
    resolver: zodResolver(zUserCv),
    defaultValues: cvData || {
      personalInfo: {},
      skills: [],
      languages: [],
      certifications: [],
      experience: [],
      education: [],
      projects: [],
    },
  });

  useEffect(() => {
    if (cvData) {
      reset(cvData);
    }
  }, [cvData, reset]);

  const skillsArray = useFieldArray({
    control,
    name: "skills" as any,
  }) as any;

  const languagesArray = useFieldArray({
    control,
    name: "languages" as any,
  }) as any;

  const certificationsArray = useFieldArray({
    control,
    name: "certifications" as any,
  }) as any;

  const experienceArray = useFieldArray({
    control,
    name: "experience" as any,
  }) as any;

  const educationArray = useFieldArray({
    control,
    name: "education" as any,
  }) as any;

  const projectsArray = useFieldArray({
    control,
    name: "projects" as any,
  }) as any;

  const handleNext = async () => {
    let isValid = false;

    // Validation for the current step
    switch (currentStep) {
      case FormStep.PERSONAL_INFO:
        isValid = await trigger(["personalInfo"]);
        break;
      case FormStep.SKILLS_LANGUAGES_CERTS:
        isValid = await trigger(["skills", "languages", "certifications"]);
        break;
      case FormStep.EXPERIENCE:
        isValid = await trigger(["experience"]);
        break;
      case FormStep.EDUCATION:
        isValid = await trigger(["education"]);
        break;
      case FormStep.PROJECTS:
        isValid = await trigger(["projects"]);
        break;
    }

    if (isValid && currentStep < FormStep.PROJECTS) {
      setCurrentStep((prevStep) => (prevStep + 1) as FormStep);
    }
  };

  const handleBack = () => {
    if (currentStep > FormStep.PERSONAL_INFO) {
      setCurrentStep((prevStep) => (prevStep - 1) as FormStep);
    }
  };

  const handleSubmitClick = () => {
    const data = getValues();
    updateCvData(data);

    const formData = new FormData();
    formData.append("cvData", JSON.stringify(data));

    submit(formData, { method: "post", action: "/upload-cv" });
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case FormStep.PERSONAL_INFO:
        return <PersonalInfoSection register={register} errors={errors} />;
      case FormStep.SKILLS_LANGUAGES_CERTS:
        return (
          <SkillsLanguagesCertsSection
            register={register}
            errors={errors}
            skillsArray={skillsArray}
            languagesArray={languagesArray}
            certificationsArray={certificationsArray}
          />
        );
      case FormStep.EXPERIENCE:
        return (
          <ExperienceSection
            register={register}
            errors={errors}
            experienceArray={experienceArray}
            control={control}
          />
        );
      case FormStep.EDUCATION:
        return (
          <EducationSection
            register={register}
            errors={errors}
            educationArray={educationArray}
          />
        );
      case FormStep.PROJECTS:
        return (
          <ProjectsSection
            register={register}
            errors={errors}
            projectsArray={projectsArray}
            control={control}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Form
      method="post"
      action="/upload-cv"
      className={styles.cvForm}
      onSubmit={(event) => event.preventDefault()}
    >
      <div className={styles.stepIndicator}>
        <h2>{STEP_TITLES[currentStep]}</h2>
        <p>
          Step {currentStep + 1} of {Object.keys(STEP_TITLES).length}
        </p>
      </div>

      {renderCurrentStep()}

      <div className={styles.navigationButtons}>
        {currentStep > FormStep.PERSONAL_INFO && (
          <button
            type="button"
            onClick={handleBack}
            className={styles.backButton}
          >
            Back
          </button>
        )}
        {currentStep < FormStep.PROJECTS ? (
          <button
            type="button"
            onClick={handleNext}
            className={styles.nextButton}
          >
            Next
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmitClick}
            className={styles.submitButton}
          >
            Submit CV
          </button>
        )}
      </div>
    </Form>
  );
}
