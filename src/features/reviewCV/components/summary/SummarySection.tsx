import type { PersonalInfo } from "@api/career-service/types.gen";
import CVSection from "@features/reviewCV/components/CVSection";
import classes from "./SummarySection.module.scss";

interface SummarySectionProps {
  summary: PersonalInfo["summary"];
  onEdit: () => void;
}

export default function SummarySection({
  summary,
  onEdit,
}: SummarySectionProps) {
  return (
    <CVSection title="Professional Summary" onEdit={onEdit}>
      <p className={classes.summaryText}>{summary}</p>
    </CVSection>
  );
}
