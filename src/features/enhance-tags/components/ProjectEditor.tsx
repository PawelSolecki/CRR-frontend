import EntryEditor from "./EntryEditor";
import type { ProjectItem } from "../types";

interface ProjectEditorProps {
  index: number;
  project: ProjectItem;
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

export default function ProjectEditor({
  index,
  project,
  onTechnologyAdd,
  onTechnologyRemove,
}: ProjectEditorProps) {
  return (
    <EntryEditor
      title={project.name || "Unnamed Project"}
      link={project.url ? { href: project.url } : undefined}
      bulletPoints={project.summaries}
      emptyMessage="No description for this project"
      onAddTechnology={(bulletIndex, technology) =>
        onTechnologyAdd(index, bulletIndex, technology)
      }
      onRemoveTechnology={(bulletIndex, technology) =>
        onTechnologyRemove(index, bulletIndex, technology)
      }
    />
  );
}
