import CVSection from "@features/reviewCV/components/CVSection";
import classes from "./SkillsSection.module.scss";

interface SkillsSectionProps {
  skills: string[];
  onEdit: () => void;
}

export default function SkillsSection({ skills, onEdit }: SkillsSectionProps) {
  return (
    <CVSection title="Skills" itemCount={skills.length} onEdit={onEdit}>
      <div className={classes.skillsList}>
        {skills.map((skill, index) => (
          <span key={index} className={classes.skillTag}>
            {skill}
          </span>
        ))}
      </div>
    </CVSection>
  );
}
