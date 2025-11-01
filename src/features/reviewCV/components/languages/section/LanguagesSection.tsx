import type { UserCv } from "@api/career-service/types.gen";
import CVSection from "@features/reviewCV/components/CVSection";
import classes from "./LanguagesSection.module.scss";

interface LanguageSectionProps {
  languages: UserCv["languages"];
  onEdit: () => void;
}

export default function LanguageSection({
  languages,
  onEdit,
}: LanguageSectionProps) {
  return (
    <CVSection title="Languages" itemCount={languages?.length} onEdit={onEdit}>
      <div className={classes.languagesList}>
        {languages?.map((language, index) => (
          <div key={index} className={classes.languageItem}>
            <span className={classes.languageName}>{language.language}</span>
            <span className={classes.languageLevel}>{language.level}</span>
          </div>
        ))}
      </div>
    </CVSection>
  );
}
