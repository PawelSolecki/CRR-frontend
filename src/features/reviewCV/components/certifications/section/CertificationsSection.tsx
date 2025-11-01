import type { UserCv } from "@api/career-service/types.gen";
import CVSection from "@features/reviewCV/components/CVSection";
import classes from "./CertificationsSection.module.scss";

interface CertificationsSectionProps {
  certifications: UserCv["certifications"];
  onEdit: () => void;
}

export default function CertificationsSection({
  certifications,
  onEdit,
}: CertificationsSectionProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long" });
  };

  return (
    <CVSection
      title="Certifications"
      itemCount={certifications?.length}
      onEdit={onEdit}
    >
      {certifications?.map((cert, index) => (
        <div key={index} className={classes.certificationItem}>
          <h3 className={classes.certificationTitle}>{cert.name}</h3>
          <p className={classes.certificationIssuer}>{cert.issuer}</p>
          <p className={classes.certificationDate}>{formatDate(cert.date)}</p>
        </div>
      ))}
    </CVSection>
  );
}
