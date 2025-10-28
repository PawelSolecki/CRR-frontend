import type { UseFormRegister, UseFieldArrayReturn } from "react-hook-form";
import { z } from "zod";
import { zUserCv } from "../../../../api/career-service/zod.gen";
import Input from "../../../../shared/components/Input";
import { Trash2 } from "lucide-react";
import styles from "./FormSections.module.scss";

type UserCvForm = z.infer<typeof zUserCv>;

interface EducationSectionProps {
  register: UseFormRegister<UserCvForm>;
  errors: any;
  educationArray: UseFieldArrayReturn<UserCvForm, "education", "id">;
}

export default function EducationSection({
  register,
  errors,
  educationArray,
}: EducationSectionProps) {
  return (
    <div className={styles.formSection}>
      {educationArray.fields.map((field, index) => (
        <div key={field.id} className={styles.educationItem}>
          <button
            type="button"
            onClick={() => educationArray.remove(index)}
            className={styles.deleteButton}
            aria-label="Remove education"
          >
            <Trash2 size={18} />
          </button>
          <Input
            label="School"
            id={`edu-school-${index}`}
            {...register(`education.${index}.school` as const)}
            error={errors.education?.[index]?.school?.message}
          />
          <Input
            label="Degree"
            id={`edu-degree-${index}`}
            {...register(`education.${index}.degree` as const)}
            error={errors.education?.[index]?.degree?.message}
          />
          <Input
            label="Field of Study"
            id={`edu-field-${index}`}
            {...register(`education.${index}.fieldOfStudy` as const)}
            error={errors.education?.[index]?.fieldOfStudy?.message}
          />
          <div className={styles.formRow}>
            <Input
              label="Start Date"
              id={`edu-start-${index}`}
              type="date"
              {...register(`education.${index}.startDate` as const)}
              error={errors.education?.[index]?.startDate?.message}
            />
            <Input
              label="End Date"
              id={`edu-end-${index}`}
              type="date"
              {...register(`education.${index}.endDate` as const)}
              error={errors.education?.[index]?.endDate?.message}
            />
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() =>
          educationArray.append({ school: "", degree: "", fieldOfStudy: "" })
        }
        className={styles.addButton}
      >
        + Add Education
      </button>
    </div>
  );
}
