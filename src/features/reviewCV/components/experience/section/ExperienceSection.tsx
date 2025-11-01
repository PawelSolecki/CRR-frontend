import type { UserCv } from "@api/career-service/types.gen";
import CVSection from "@features/reviewCV/components/CVSection";
import classes from "./ExperienceSection.module.scss";

interface ExperienceSectionProps {
  experience: UserCv["experience"];
  onEdit: () => void;
}

export default function ExperienceSection({
  experience,
  onEdit,
}: ExperienceSectionProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long" });
  };

  return (
    <CVSection
      title="Work Experience"
      itemCount={experience?.length}
      onEdit={onEdit}
    >
      {experience?.map((exp, index) => (
        <div key={index} className={classes.experienceItem}>
          <h3 className={classes.experienceTitle}>{exp.position}</h3>
          <p className={classes.experienceCompany}>
            {exp.url ? (
              <a href={exp.url} target="_blank" rel="noopener noreferrer">
                {exp.company}
              </a>
            ) : (
              exp.company
            )}
            {exp.location && ` • ${exp.location}`}
          </p>
          <p className={classes.experienceDate}>
            {formatDate(exp.startDate)} -{" "}
            {exp.endDate ? formatDate(exp.endDate) : "Present"}
          </p>
        </div>
      ))}
    </CVSection>
  );
}
