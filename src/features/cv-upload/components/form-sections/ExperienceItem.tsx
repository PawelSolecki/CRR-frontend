import type { UseFormRegister, Control } from "react-hook-form";
import { useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zUserCv } from "../../../../api/career-service/zod.gen";
import Input from "../../../../shared/components/Input";
import { Trash2 } from "lucide-react";
import styles from "./FormSections.module.scss";

type UserCvForm = z.infer<typeof zUserCv>;

interface ExperienceItemProps {
  index: number;
  register: UseFormRegister<UserCvForm>;
  errors: any;
  control: Control<UserCvForm>;
  onRemove: () => void;
}

export default function ExperienceItem({
  index,
  register,
  errors,
  control,
  onRemove,
}: ExperienceItemProps) {
  const summariesArray = useFieldArray({
    control,
    name: `experience.${index}.summaries` as const,
  });

  return (
    <div className={styles.experienceItem}>
      <button
        type="button"
        onClick={onRemove}
        className={styles.deleteButton}
        aria-label="Remove experience"
      >
        <Trash2 size={18} />
      </button>

      <Input
        label="Position"
        id={`exp-position-${index}`}
        {...register(`experience.${index}.position` as const)}
        error={errors.experience?.[index]?.position?.message}
      />
      <Input
        label="Company"
        id={`exp-company-${index}`}
        {...register(`experience.${index}.company` as const)}
        error={errors.experience?.[index]?.company?.message}
      />
      <Input
        label="Location"
        id={`exp-location-${index}`}
        {...register(`experience.${index}.location` as const)}
        error={errors.experience?.[index]?.location?.message}
      />
      <div className={styles.formRow}>
        <Input
          label="Start Date"
          id={`exp-start-${index}`}
          type="date"
          {...register(`experience.${index}.startDate` as const)}
          error={errors.experience?.[index]?.startDate?.message}
        />
        <Input
          label="End Date"
          id={`exp-end-${index}`}
          type="date"
          {...register(`experience.${index}.endDate` as const)}
          error={errors.experience?.[index]?.endDate?.message}
        />
      </div>

      <div className={styles.summariesSection}>
        <h4>Bullet Points (Responsibilities & Achievements)</h4>
        <div className={styles.bulletPointsList}>
          {summariesArray.fields.map((summaryField, summaryIndex) => (
            <div key={summaryField.id} className={styles.inlineItem}>
              <div className={styles.inlineInput}>
                <Input
                  label=""
                  id={`exp-summary-text-${index}-${summaryIndex}`}
                  {...register(
                    `experience.${index}.summaries.${summaryIndex}.text` as const
                  )}
                  error={
                    errors.experience?.[index]?.summaries?.[summaryIndex]?.text
                      ?.message
                  }
                  placeholder="e.g., Developed a new feature that increased user engagement by 30%"
                />
              </div>
              <button
                type="button"
                onClick={() => summariesArray.remove(summaryIndex)}
                className={styles.iconButton}
                aria-label="Remove bullet point"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => summariesArray.append({ text: "", technologies: [] })}
          className={styles.addButton}
        >
          + Add Bullet Point
        </button>
      </div>
    </div>
  );
}
