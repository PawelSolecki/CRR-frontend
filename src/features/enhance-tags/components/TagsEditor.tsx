import { FormNavigation } from "@features/navigation";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { AnalyzedCvData } from "../types";
import ExperienceEditor from "./ExperienceEditor";
import ProjectEditor from "./ProjectEditor";
import styles from "./TagsEditor.module.scss";

interface TagsEditorProps {
  cvData: AnalyzedCvData;
  onSave: (updatedCvData: AnalyzedCvData) => void;
  onCancel?: () => void;
}

export default function TagsEditor({
  cvData,
  onSave,
  onCancel,
}: TagsEditorProps) {
  const [editedData, setEditedData] = useState<AnalyzedCvData>(cvData);
  const [isExperienceExpanded, setIsExperienceExpanded] = useState(true);
  const [isProjectsExpanded, setIsProjectsExpanded] = useState(true);
  const navigate = useNavigate();

  const handleExperienceTechnologyChange = (
    experienceIndex: number,
    bulletIndex: number,
    technology: string,
    action: "add" | "remove"
  ) => {
    setEditedData((current) => {
      if (!current.experience) {
        return current;
      }

      let hasChanged = false;

      const updatedExperience = current.experience.map((experience, index) => {
        if (index !== experienceIndex) {
          return experience;
        }

        const summaries = experience.summaries;
        if (!summaries || !summaries[bulletIndex]) {
          return experience;
        }

        const targetBullet = summaries[bulletIndex];
        const technologies = targetBullet.technologies ?? [];
        const hasTechnology = technologies.includes(technology);

        if (action === "add" && !hasTechnology) {
          const updatedBullet = {
            ...targetBullet,
            technologies: [...technologies, technology],
          };
          const updatedSummaries = [...summaries];
          updatedSummaries[bulletIndex] = updatedBullet;
          hasChanged = true;
          return {
            ...experience,
            summaries: updatedSummaries,
          };
        }

        if (action === "remove" && hasTechnology) {
          const updatedBullet = {
            ...targetBullet,
            technologies: technologies.filter((tech) => tech !== technology),
          };
          const updatedSummaries = [...summaries];
          updatedSummaries[bulletIndex] = updatedBullet;
          hasChanged = true;
          return {
            ...experience,
            summaries: updatedSummaries,
          };
        }

        return experience;
      });

      if (!hasChanged) {
        return current;
      }

      return {
        ...current,
        experience: updatedExperience,
      };
    });
  };

  const handleProjectTechnologyChange = (
    projectIndex: number,
    bulletIndex: number,
    technology: string,
    action: "add" | "remove"
  ) => {
    setEditedData((current) => {
      if (!current.projects) {
        return current;
      }

      let hasChanged = false;

      const updatedProjects = current.projects.map((project, index) => {
        if (index !== projectIndex) {
          return project;
        }

        const summaries = project.summaries;
        if (!summaries || !summaries[bulletIndex]) {
          return project;
        }

        const targetBullet = summaries[bulletIndex];
        const technologies = targetBullet.technologies ?? [];
        const hasTechnology = technologies.includes(technology);

        if (action === "add" && !hasTechnology) {
          const updatedBullet = {
            ...targetBullet,
            technologies: [...technologies, technology],
          };
          const updatedSummaries = [...summaries];
          updatedSummaries[bulletIndex] = updatedBullet;
          hasChanged = true;
          return {
            ...project,
            summaries: updatedSummaries,
          };
        }

        if (action === "remove" && hasTechnology) {
          const updatedBullet = {
            ...targetBullet,
            technologies: technologies.filter((tech) => tech !== technology),
          };
          const updatedSummaries = [...summaries];
          updatedSummaries[bulletIndex] = updatedBullet;
          hasChanged = true;
          return {
            ...project,
            summaries: updatedSummaries,
          };
        }

        return project;
      });

      if (!hasChanged) {
        return current;
      }

      return {
        ...current,
        projects: updatedProjects,
      };
    });
  };

  const handleSave = () => {
    onSave(editedData);
  };

  return (
    <div className={styles.tagsEditor}>
      <div className={styles.header}>
        <h1>Edit Detected Technologies</h1>
        <p className={styles.subtitle}>
          Review and edit technologies assigned to your CV bullet points. You
          can remove mismatched tags or add new ones.
        </p>
      </div>

      {editedData.experience && editedData.experience.length > 0 && (
        <div className={styles.section}>
          <div
            className={styles.sectionHeader}
            onClick={() => setIsExperienceExpanded(!isExperienceExpanded)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                setIsExperienceExpanded(!isExperienceExpanded);
              }
            }}
          >
            <h2 className={styles.sectionTitle}>Work Experience</h2>
            <div className={styles.sectionToggle}>
              {isExperienceExpanded ? "−" : "+"}
            </div>
          </div>
          {isExperienceExpanded && (
            <div className={styles.sectionContent}>
              {editedData.experience.map((experience, index) => (
                <ExperienceEditor
                  key={index}
                  index={index}
                  experience={experience}
                  onTechnologyAdd={(entryIndex, bulletIndex, technology) =>
                    handleExperienceTechnologyChange(
                      entryIndex,
                      bulletIndex,
                      technology,
                      "add"
                    )
                  }
                  onTechnologyRemove={(entryIndex, bulletIndex, technology) =>
                    handleExperienceTechnologyChange(
                      entryIndex,
                      bulletIndex,
                      technology,
                      "remove"
                    )
                  }
                />
              ))}
            </div>
          )}
        </div>
      )}

      {editedData.projects && editedData.projects.length > 0 && (
        <div className={styles.section}>
          <div
            className={styles.sectionHeader}
            onClick={() => setIsProjectsExpanded(!isProjectsExpanded)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                setIsProjectsExpanded(!isProjectsExpanded);
              }
            }}
          >
            <h2 className={styles.sectionTitle}>Projects</h2>
            <div className={styles.sectionToggle}>
              {isProjectsExpanded ? "−" : "+"}
            </div>
          </div>
          {isProjectsExpanded && (
            <div className={styles.sectionContent}>
              {editedData.projects.map((project, index) => (
                <ProjectEditor
                  key={index}
                  index={index}
                  project={project}
                  onTechnologyAdd={(entryIndex, bulletIndex, technology) =>
                    handleProjectTechnologyChange(
                      entryIndex,
                      bulletIndex,
                      technology,
                      "add"
                    )
                  }
                  onTechnologyRemove={(entryIndex, bulletIndex, technology) =>
                    handleProjectTechnologyChange(
                      entryIndex,
                      bulletIndex,
                      technology,
                      "remove"
                    )
                  }
                />
              ))}
            </div>
          )}
        </div>
      )}

      {(!editedData.experience || editedData.experience.length === 0) &&
        (!editedData.projects || editedData.projects.length === 0) && (
          <div className={styles.emptyState}>
            No work experience or projects to edit
          </div>
        )}
      <FormNavigation
        onNext={() => {
          handleSave();
          navigate("/job-offer");
        }}
        onBack={onCancel}
        // nextText="Continue"
      />
    </div>
  );
}
