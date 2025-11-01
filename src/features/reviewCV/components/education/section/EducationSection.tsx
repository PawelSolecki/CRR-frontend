import type { UserCv } from "@api/career-service/types.gen";
import CVSection from "@features/reviewCV/components/CVSection";
import classes from "./EducationSection.module.scss";

interface EducationSectionProps {
  education: UserCv["education"];
  onEdit: () => void;
}

export default function EducationSection({
  education,
  onEdit,
}: EducationSectionProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long" });
  };

  return (
    <CVSection title="Education" itemCount={education?.length} onEdit={onEdit}>
      {education?.map((edu, index) => (
        <div key={index} className={classes.educationItem}>
          <h3 className={classes.educationTitle}>
            {edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}
          </h3>
          <p className={classes.educationSchool}>{edu.school}</p>
          <p className={classes.educationDate}>
            {formatDate(edu.startDate)} -{" "}
            {edu.endDate ? formatDate(edu.endDate) : "Present"}
          </p>
        </div>
      ))}
    </CVSection>
  );
}
