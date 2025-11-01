import type { Project, Summary } from "@api/career-service/types.gen";
import Button from "@shared/components/Button/Button";
import Icon from "@shared/components/Icon/Icon";
import Input from "@shared/components/Input/Input";
import Modal from "@shared/components/Modal/Modal";
import { useCallback, useEffect, useState } from "react";
import classes from "./ProjectsModal.module.scss";

interface ProjectsModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  onUpdate: (projects: Project[]) => void;
  isLoading?: boolean;
}

export default function ProjectsModal({
  isOpen,
  onClose,
  projects,
  onUpdate,
  isLoading = false,
}: ProjectsModalProps) {
  const [localProjects, setLocalProjects] = useState<Project[]>([]);
  const [newTechnology, setNewTechnology] = useState<{ [key: string]: string }>(
    {},
  );

  // Initialize local state when modal opens
  useEffect(() => {
    if (isOpen) {
      setLocalProjects([...projects]);
      setNewTechnology({});
    }
  }, [isOpen, projects]);

  const updateProject = useCallback(
    (index: number, field: keyof Project, value: string) => {
      setLocalProjects((prev) =>
        prev.map((project, i) =>
          i === index ? { ...project, [field]: value } : project,
        ),
      );
    },
    [],
  );

  const updateSummary = useCallback(
    (
      projectIndex: number,
      summaryIndex: number,
      field: keyof Summary,
      value: string | string[],
    ) => {
      setLocalProjects((prev) =>
        prev.map((project, i) =>
          i === projectIndex
            ? {
                ...project,
                summaries:
                  project.summaries?.map((summary, j) =>
                    j === summaryIndex
                      ? { ...summary, [field]: value }
                      : summary,
                  ) || [],
              }
            : project,
        ),
      );
    },
    [],
  );

  const addProject = useCallback(() => {
    const newProject: Project = {
      name: "",
      url: "",
      summaries: [{ text: "", technologies: [] }],
    };
    setLocalProjects((prev) => [...prev, newProject]);
  }, []);

  const removeProject = useCallback((index: number) => {
    setLocalProjects((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const addSummary = useCallback((projectIndex: number) => {
    setLocalProjects((prev) =>
      prev.map((project, i) =>
        i === projectIndex
          ? {
              ...project,
              summaries: [
                ...(project.summaries || []),
                { text: "", technologies: [] },
              ],
            }
          : project,
      ),
    );
  }, []);

  const removeSummary = useCallback(
    (projectIndex: number, summaryIndex: number) => {
      setLocalProjects((prev) =>
        prev.map((project, i) =>
          i === projectIndex
            ? {
                ...project,
                summaries:
                  project.summaries?.filter((_, j) => j !== summaryIndex) || [],
              }
            : project,
        ),
      );
    },
    [],
  );

  const addTechnology = useCallback(
    (projectIndex: number, summaryIndex: number) => {
      const key = `${projectIndex}-${summaryIndex}`;
      const techValue = newTechnology[key]?.trim();

      if (techValue) {
        const currentTechnologies =
          localProjects[projectIndex].summaries?.[summaryIndex].technologies ||
          [];
        if (!currentTechnologies.includes(techValue)) {
          updateSummary(projectIndex, summaryIndex, "technologies", [
            ...currentTechnologies,
            techValue,
          ]);
          setNewTechnology((prev) => ({ ...prev, [key]: "" }));
        }
      }
    },
    [localProjects, newTechnology, updateSummary],
  );

  const removeTechnology = useCallback(
    (projectIndex: number, summaryIndex: number, techIndex: number) => {
      const currentTechnologies =
        localProjects[projectIndex].summaries?.[summaryIndex].technologies ||
        [];
      updateSummary(
        projectIndex,
        summaryIndex,
        "technologies",
        currentTechnologies.filter((_, i) => i !== techIndex),
      );
    },
    [localProjects, updateSummary],
  );

  const handleSave = useCallback(() => {
    onUpdate(localProjects);
    onClose();
  }, [localProjects, onUpdate, onClose]);

  const handleCancel = useCallback(() => {
    setLocalProjects([...projects]); // Reset to original
    setNewTechnology({});
    onClose();
  }, [projects, onClose]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title="Edit Projects"
      size="large"
    >
      <div className={classes.modalContent}>
        <div className={classes.sectionHeader}>
          <h3>Personal & Professional Projects</h3>
          <Button type="secondary" onClick={addProject} disabled={isLoading}>
            <Icon iconName="plus" />
            Add Project
          </Button>
        </div>

        {localProjects.map((project, projectIndex) => (
          <div key={projectIndex} className={classes.projectModalItem}>
            <div className={classes.itemHeader}>
              <h4>Project {projectIndex + 1}</h4>
              <Button
                type="secondary"
                onClick={() => removeProject(projectIndex)}
                disabled={isLoading}
              >
                <Icon iconName="trash" />
              </Button>
            </div>

            <div className={classes.formGrid}>
              <Input
                id={`project-name-${projectIndex}`}
                type="text"
                label="Project Name"
                value={project.name || ""}
                onChange={(e) =>
                  updateProject(projectIndex, "name", e.target.value)
                }
                disabled={isLoading}
                style={{ gridColumn: "1 / -1" }}
              />
              <Input
                id={`project-url-${projectIndex}`}
                type="text"
                label="Project URL"
                value={project.url || ""}
                onChange={(e) =>
                  updateProject(projectIndex, "url", e.target.value)
                }
                disabled={isLoading}
                style={{ gridColumn: "1 / -1" }}
              />
            </div>

            <div className={classes.summariesSection}>
              <div className={classes.summariesHeader}>
                <h5>Project Details & Features</h5>
                <Button
                  type="secondary"
                  onClick={() => addSummary(projectIndex)}
                  disabled={isLoading}
                >
                  <Icon iconName="plus" />
                  Add Detail
                </Button>
              </div>

              {project.summaries?.map((summary, summaryIndex) => (
                <div key={summaryIndex} className={classes.summaryItem}>
                  <div className={classes.summaryHeader}>
                    <span>Detail {summaryIndex + 1}</span>
                    <Button
                      type="secondary"
                      onClick={() => removeSummary(projectIndex, summaryIndex)}
                      disabled={isLoading}
                    >
                      <Icon iconName="trash" />
                    </Button>
                  </div>

                  <Input
                    id={`project-summary-text-${projectIndex}-${summaryIndex}`}
                    type="textarea"
                    label="Description"
                    value={summary.text || ""}
                    onChange={(e) =>
                      updateSummary(
                        projectIndex,
                        summaryIndex,
                        "text",
                        e.target.value,
                      )
                    }
                    disabled={isLoading}
                    style={{ width: "100%" }}
                  />

                  <div className={classes.technologiesSection}>
                    <label className={classes.technologiesLabel}>
                      Technologies Used
                    </label>
                    <div className={classes.technologiesList}>
                      {summary.technologies?.map((tech, techIndex) => (
                        <div key={techIndex} className={classes.techTag}>
                          <span>{tech}</span>
                          <button
                            type="button"
                            onClick={() =>
                              removeTechnology(
                                projectIndex,
                                summaryIndex,
                                techIndex,
                              )
                            }
                            className={classes.techRemoveButton}
                            disabled={isLoading}
                          >
                            <Icon iconName="x" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className={classes.addTechSection}>
                      <Input
                        id={`project-new-tech-${projectIndex}-${summaryIndex}`}
                        type="text"
                        label="Add Technology"
                        placeholder="e.g., React, Node.js"
                        value={
                          newTechnology[`${projectIndex}-${summaryIndex}`] || ""
                        }
                        onChange={(e) =>
                          setNewTechnology((prev) => ({
                            ...prev,
                            [`${projectIndex}-${summaryIndex}`]: e.target.value,
                          }))
                        }
                        disabled={isLoading}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addTechnology(projectIndex, summaryIndex);
                          }
                        }}
                      />
                      <Button
                        type="secondary"
                        onClick={() =>
                          addTechnology(projectIndex, summaryIndex)
                        }
                        disabled={
                          !newTechnology[
                            `${projectIndex}-${summaryIndex}`
                          ]?.trim() || isLoading
                        }
                      >
                        <Icon iconName="plus" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className={classes.modalActions}>
          <Button type="secondary" onClick={handleCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="primary" onClick={handleSave} disabled={isLoading}>
            Save Changes
          </Button>
        </div>
      </div>
    </Modal>
  );
}
