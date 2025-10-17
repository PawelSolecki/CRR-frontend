import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { zUserCv } from "../../../api/career-service/zod.gen";
import PersonalInfoSection from "./form-sections/PersonalInfoSection";
import SkillsLanguagesCertsSection from "./form-sections/SkillsLanguagesCertsSection";
import ExperienceSection from "./form-sections/ExperienceSection";
import EducationSection from "./form-sections/EducationSection";
import ProjectsSection from "./form-sections/ProjectsSection";
import styles from "./CvForm.module.scss";

type UserCvForm = z.infer<typeof zUserCv>;

enum FormStep {
  PERSONAL_INFO = 0,
  SKILLS_LANGUAGES_CERTS = 1,
  EDUCATION = 2,
  EXPERIENCE = 3,
  PROJECTS = 4,
}

const STEP_TITLES = {
  [FormStep.PERSONAL_INFO]: "Personal Information",
  [FormStep.SKILLS_LANGUAGES_CERTS]: "Skills, Languages & Certifications",
  [FormStep.EXPERIENCE]: "Work Experience",
  [FormStep.EDUCATION]: "Education",
  [FormStep.PROJECTS]: "Projects",
};

interface CvFormProps {
  onSubmit: (data: UserCvForm) => void;
  defaultValues?: Partial<UserCvForm>;
}

export default function CvForm({ onSubmit, defaultValues }: CvFormProps) {
  const [currentStep, setCurrentStep] = useState<FormStep>(
    FormStep.PERSONAL_INFO
  );

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm<UserCvForm>({
    resolver: zodResolver(zUserCv),
    defaultValues: defaultValues || {
      personalInfo: {},
      skills: [],
      languages: [],
      certifications: [],
      experience: [],
      education: [],
      projects: [],
    },
  });

  const skillsArray = useFieldArray({
    control,
    name: "skills",
  });

  const languagesArray = useFieldArray({
    control,
    name: "languages",
  });

  const certificationsArray = useFieldArray({
    control,
    name: "certifications",
  });

  const experienceArray = useFieldArray({
    control,
    name: "experience",
  });

  const educationArray = useFieldArray({
    control,
    name: "education",
  });

  const projectsArray = useFieldArray({
    control,
    name: "projects",
  });

  const handleNext = async () => {
    let isValid = false;

    // Walidacja tylko dla aktualnego kroku
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
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > FormStep.PERSONAL_INFO) {
      setCurrentStep(currentStep - 1);
    }
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
    <form onSubmit={handleSubmit(onSubmit)} className={styles.cvForm}>
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
          <button type="submit" className={styles.submitButton}>
            Submit CV
          </button>
        )}
      </div>
    </form>
  );
}
