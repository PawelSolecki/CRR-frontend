import { zUserCv } from "@api/career-service/zod.gen";
import type {
  Control,
  UseFieldArrayReturn,
  UseFormRegister,
} from "react-hook-form";
import { z } from "zod";
import styles from "./FormSections.module.scss";
import ProjectItem from "./ProjectItem";

type UserCvForm = z.infer<typeof zUserCv>;

interface ProjectsSectionProps {
  register: UseFormRegister<UserCvForm>;
  errors: any;
  projectsArray: UseFieldArrayReturn<UserCvForm, "projects", "id">;
  control: Control<UserCvForm>;
}

export default function ProjectsSection({
  register,
  errors,
  projectsArray,
  control,
}: ProjectsSectionProps) {
  return (
    <div className={styles.formSection}>
      {projectsArray.fields.map((field, index) => (
        <ProjectItem
          key={field.id}
          index={index}
          register={register}
          errors={errors}
          control={control}
          onRemove={() => projectsArray.remove(index)}
        />
      ))}
      <button
        type="button"
        onClick={() =>
          projectsArray.append({ name: "", url: "", summaries: [] })
        }
        className={styles.addButton}
      >
        + Add Project
      </button>
    </div>
  );
}
