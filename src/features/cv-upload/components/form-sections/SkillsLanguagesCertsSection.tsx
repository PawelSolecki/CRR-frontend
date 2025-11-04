import { zUserCv } from "@api/career-service/zod.gen";
import Input from "@shared/components/Input/Input";
import { Trash2 } from "lucide-react";
import type { UseFieldArrayReturn, UseFormRegister } from "react-hook-form";
import { z } from "zod";
import styles from "./FormSections.module.scss";

type UserCvForm = z.infer<typeof zUserCv>;

interface SkillsLanguagesCertsSectionProps {
  register: UseFormRegister<UserCvForm>;
  errors: any;
  skillsArray: UseFieldArrayReturn<UserCvForm, "skills", "id">;
  languagesArray: UseFieldArrayReturn<UserCvForm, "languages", "id">;
  certificationsArray: UseFieldArrayReturn<UserCvForm, "certifications", "id">;
}
export default function SkillsLanguagesCertsSection({
  register,
  errors,
  skillsArray,
  languagesArray,
  certificationsArray,
}: SkillsLanguagesCertsSectionProps) {
  return (
    <div className={styles.formSection}>
      <h3>Skills</h3>
      <div className={styles.skillsGrid}>
        {skillsArray.fields.map((field, index) => (
          <div key={field.id} className={styles.inlineItem}>
            <div className={styles.inlineInput}>
              <Input
                label=""
                id={`skill-${index}`}
                {...register(`skills.${index}` as const)}
                error={errors.skills?.[index]?.message}
                placeholder="e.g., JavaScript, React, Node.js"
              />
            </div>
            <button
              type="button"
              onClick={() => skillsArray.remove(index)}
              className={styles.iconButton}
              aria-label="Remove skill"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => skillsArray.append("")}
        className={styles.addButton}
      >
        + Add Skill
      </button>

      <h3 className={styles.sectionTitle}>Languages</h3>
      {languagesArray.fields.map((field, index) => (
        <div key={field.id} className={styles.inlineItem}>
          <div className={styles.inlineInputGroup}>
            <Input
              label="Language"
              id={`language-${index}`}
              {...register(`languages.${index}.language` as const)}
              error={errors.languages?.[index]?.language?.message}
            />
            <div>
              <label className={styles.selectLabel}>Level</label>
              <select
                {...register(`languages.${index}.level` as const)}
                className={styles.select}
              >
                <option value="">Select Level</option>
                <option value="A1">A1</option>
                <option value="A2">A2</option>
                <option value="B1">B1</option>
                <option value="B2">B2</option>
                <option value="C1">C1</option>
                <option value="C2">C2</option>
              </select>
            </div>
          </div>
          <button
            type="button"
            onClick={() => languagesArray.remove(index)}
            className={styles.iconButton}
            aria-label="Remove language"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() =>
          languagesArray.append({ language: "", level: undefined })
        }
        className={styles.addButton}
      >
        + Add Language
      </button>

      <h3 className={styles.sectionTitle}>Certifications</h3>
      {certificationsArray.fields.map((field, index) => (
        <div key={field.id} className={styles.certItem}>
          <div className={styles.certInputs}>
            <Input
              label="Certification Name"
              id={`cert-name-${index}`}
              {...register(`certifications.${index}.name` as const)}
              error={errors.certifications?.[index]?.name?.message}
            />
            <Input
              label="Issuer"
              id={`cert-issuer-${index}`}
              {...register(`certifications.${index}.issuer` as const)}
              error={errors.certifications?.[index]?.issuer?.message}
            />
            <Input
              label="Date"
              id={`cert-date-${index}`}
              type="date"
              {...register(`certifications.${index}.date` as const)}
              error={errors.certifications?.[index]?.date?.message}
            />
          </div>
          <button
            type="button"
            onClick={() => certificationsArray.remove(index)}
            className={styles.iconButton}
            aria-label="Remove certification"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() =>
          certificationsArray.append({ name: "", issuer: "", date: "" })
        }
        className={styles.addButton}
      >
        + Add Certification
      </button>
    </div>
  );
}
