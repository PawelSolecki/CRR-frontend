import type {
  UseFormRegister,
  UseFieldArrayReturn,
  Control,
} from "react-hook-form";
import { z } from "zod";
import { zUserCv } from "../../../../api/career-service/zod.gen";
import ExperienceItem from "./ExperienceItem";
import styles from "./FormSections.module.scss";

type UserCvForm = z.infer<typeof zUserCv>;

interface ExperienceSectionProps {
  register: UseFormRegister<UserCvForm>;
  errors: any;
  experienceArray: UseFieldArrayReturn<UserCvForm, "experience", "id">;
  control: Control<UserCvForm>;
}

export default function ExperienceSection({
  register,
  errors,
  experienceArray,
  control,
}: ExperienceSectionProps) {
  return (
    <div className={styles.formSection}>
      {experienceArray.fields.map((field, index) => (
        <ExperienceItem
          key={field.id}
          index={index}
          register={register}
          errors={errors}
          control={control}
          onRemove={() => experienceArray.remove(index)}
        />
      ))}
      <button
        type="button"
        onClick={() =>
          experienceArray.append({
            position: "",
            company: "",
            location: "",
            summaries: [],
          })
        }
        className={styles.addButton}
      >
        + Add Experience
      </button>
    </div>
  );
}
