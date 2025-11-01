import type { PersonalInfo } from "@api/career-service/types.gen";
import CVSection from "@features/reviewCV/components/CVSection";
import classes from "./PersonalInfoSection.module.scss";

interface PersonalInfoSectionProps {
  personalInfo: PersonalInfo;
  onEdit: () => void;
}

export default function PersonalInfoSection({
  personalInfo,
  onEdit,
}: PersonalInfoSectionProps) {
  return (
    <CVSection title="Personal Information" onEdit={onEdit}>
      <div className={classes.infoGrid}>
        <div className={classes.infoItem}>
          <span className={classes.infoLabel}>Name:</span>
          <span className={classes.infoValue}>
            {personalInfo.firstName} {personalInfo.lastName}
          </span>
        </div>
        <div className={classes.infoItem}>
          <span className={classes.infoLabel}>Email:</span>
          <span className={classes.infoValue}>{personalInfo.email}</span>
        </div>
        <div className={classes.infoItem}>
          <span className={classes.infoLabel}>Phone:</span>
          <span className={classes.infoValue}>{personalInfo.phone}</span>
        </div>
        <div className={classes.infoItem}>
          <span className={classes.infoLabel}>Role:</span>
          <span className={classes.infoValue}>{personalInfo.role}</span>
        </div>
      </div>
    </CVSection>
  );
}
