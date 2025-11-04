import type { UserCv } from "@api/career-service/types.gen";
import CVSection from "@features/reviewCV/components/CVSection";
import classes from "./ProjectsSection.module.scss";

interface ProjectsSectionProps {
  projects: UserCv["projects"];
  onEdit: () => void;
}

export default function ProjectsSection({
  projects,
  onEdit,
}: ProjectsSectionProps) {
  return (
    <CVSection title="Projects" itemCount={projects?.length} onEdit={onEdit}>
      {projects?.map((project, index) => (
        <div key={index} className={classes.projectItem}>
          <h3 className={classes.projectTitle}>
            {project.url ? (
              <a href={project.url} target="_blank" rel="noopener noreferrer">
                {project.name}
              </a>
            ) : (
              project.name
            )}
          </h3>
        </div>
      ))}
    </CVSection>
  );
}
