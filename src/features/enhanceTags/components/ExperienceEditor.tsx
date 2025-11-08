import EntryEditor from "./EntryEditor";
import type { ExperienceItem } from "../types";

interface ExperienceEditorProps {
  index: number;
  experience: ExperienceItem;
  onTechnologyAdd: (
    entryIndex: number,
    bulletIndex: number,
    technology: string
  ) => void;
  onTechnologyRemove: (
    entryIndex: number,
    bulletIndex: number,
    technology: string
  ) => void;
}

export default function ExperienceEditor({
  index,
  experience,
  onTechnologyAdd,
  onTechnologyRemove,
}: ExperienceEditorProps) {
  const meta = experience.startDate
    ? `${experience.startDate} - ${experience.endDate || "Present"}`
    : undefined;

  return (
    <EntryEditor
      title={experience.company || "N/A"}
      subtitle={experience.position}
      meta={meta}
      bulletPoints={experience.summaries}
      emptyMessage="No descriptions for this experience"
      onAddTechnology={(bulletIndex, technology) =>
        onTechnologyAdd(index, bulletIndex, technology)
      }
      onRemoveTechnology={(bulletIndex, technology) =>
        onTechnologyRemove(index, bulletIndex, technology)
      }
    />
  );
}
