import type { UseFormRegister, Control } from "react-hook-form";
import { useFieldArray } from "react-hook-form";
import { z } from "zod";
import { Trash2 } from "lucide-react";
import { zUserCv } from "../../../../api/career-service/zod.gen";
import Input from "../../../../shared/components/Input";
import styles from "./FormSections.module.scss";

type UserCvForm = z.infer<typeof zUserCv>;

interface ProjectItemProps {
  index: number;
  register: UseFormRegister<UserCvForm>;
  errors: any;
  control: Control<UserCvForm>;
  onRemove: () => void;
}

export default function ProjectItem({
  index,
  register,
  errors,
  control,
  onRemove,
}: ProjectItemProps) {
  const summariesArray = useFieldArray({
    control,
    name: `projects.${index}.summaries` as const,
  });

  return (
    <div className={styles.projectItem}>
      <button
        type="button"
        onClick={onRemove}
        className={styles.deleteButton}
        aria-label="Remove project"
      >
        <Trash2 size={20} />
      </button>

      <Input
        label="Project Name"
        id={`proj-name-${index}`}
        {...register(`projects.${index}.name` as const)}
        error={errors.projects?.[index]?.name?.message}
      />
      <Input
        label="URL"
        id={`proj-url-${index}`}
        type="url"
        {...register(`projects.${index}.url` as const)}
        error={errors.projects?.[index]?.url?.message}
      />

      <div className={styles.summariesSection}>
        <h4>Bullet Points (Key achievements, features, or outcomes)</h4>
        <div className={styles.bulletPointsList}>
          {summariesArray.fields.map((summaryField, summaryIndex) => (
            <div key={summaryField.id} className={styles.inlineItem}>
              <div className={styles.inlineInput}>
                <Input
                  label=""
                  id={`proj-summary-text-${index}-${summaryIndex}`}
                  {...register(
                    `projects.${index}.summaries.${summaryIndex}.text` as const
                  )}
                  error={
                    errors.projects?.[index]?.summaries?.[summaryIndex]?.text
                      ?.message
                  }
                  placeholder="e.g., Increased performance by 40%, Led a team of 5 developers..."
                />
              </div>
              <button
                type="button"
                onClick={() => summariesArray.remove(summaryIndex)}
                className={styles.iconButton}
                aria-label="Remove bullet point"
              >
                <Trash2 size={20} />
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
