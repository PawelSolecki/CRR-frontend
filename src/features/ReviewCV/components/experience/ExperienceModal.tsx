import { useState } from "react";
import type {
  Experience,
  Summary,
} from "../../../../api/career-service/types.gen";
import Button from "../../../../components/ui/Button/Button";
import Icon from "../../../../components/ui/Icon/Icon";
import Input from "../../../../components/ui/Input/Input";
import Modal from "../../../../components/ui/Modal/Modal";
import classes from "./ExperienceModal.module.scss";

interface ExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  experience: Experience[];
  onUpdate: (experience: Experience[]) => void;
  isLoading?: boolean;
}

export default function ExperienceModal({
  isOpen,
  onClose,
  experience,
  onUpdate,
  isLoading = false,
}: ExperienceModalProps) {
  const [newTechnology, setNewTechnology] = useState<{ [key: string]: string }>(
    {},
  );

  const updateExperience = (
    index: number,
    field: keyof Experience,
    value: string,
  ) => {
    const updated = experience.map((exp, i) =>
      i === index ? { ...exp, [field]: value } : exp,
    );
    onUpdate(updated);
  };

  const updateSummary = (
    expIndex: number,
    summaryIndex: number,
    field: keyof Summary,
    value: string | string[],
  ) => {
    const updated = experience.map((exp, i) =>
      i === expIndex
        ? {
            ...exp,
            summaries: exp.summaries.map((summary, j) =>
              j === summaryIndex ? { ...summary, [field]: value } : summary,
            ),
          }
        : exp,
    );
    onUpdate(updated);
  };

  const addExperience = () => {
    const newExp: Experience = {
      position: "",
      company: "",
      url: "",
      location: "",
      startDate: "",
      endDate: "",
      summaries: [{ text: "", technologies: [] }],
    };
    onUpdate([...experience, newExp]);
  };

  const removeExperience = (index: number) => {
    onUpdate(experience.filter((_, i) => i !== index));
  };

  const addSummary = (expIndex: number) => {
    const updated = experience.map((exp, i) =>
      i === expIndex
        ? {
            ...exp,
            summaries: [...exp.summaries, { text: "", technologies: [] }],
          }
        : exp,
    );
    onUpdate(updated);
  };

  const removeSummary = (expIndex: number, summaryIndex: number) => {
    const updated = experience.map((exp, i) =>
      i === expIndex
        ? {
            ...exp,
            summaries: exp.summaries.filter((_, j) => j !== summaryIndex),
          }
        : exp,
    );
    onUpdate(updated);
  };

  const addTechnology = (expIndex: number, summaryIndex: number) => {
    const key = `${expIndex}-${summaryIndex}`;
    const techValue = newTechnology[key]?.trim();

    if (techValue) {
      const currentTechnologies =
        experience[expIndex].summaries[summaryIndex].technologies;
      if (!currentTechnologies.includes(techValue)) {
        updateSummary(expIndex, summaryIndex, "technologies", [
          ...currentTechnologies,
          techValue,
        ]);
        setNewTechnology({ ...newTechnology, [key]: "" });
      }
    }
  };

  const removeTechnology = (
    expIndex: number,
    summaryIndex: number,
    techIndex: number,
  ) => {
    const currentTechnologies =
      experience[expIndex].summaries[summaryIndex].technologies;
    updateSummary(
      expIndex,
      summaryIndex,
      "technologies",
      currentTechnologies.filter((_, i) => i !== techIndex),
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Work Experience"
      size="large"
    >
      <div className={classes.modalContent}>
        <div className={classes.sectionHeader}>
          <h3>Work Experience</h3>
          <Button type="secondary" onClick={addExperience} disabled={isLoading}>
            <Icon iconName="plus" />
            Add Experience
          </Button>
        </div>

        {experience.map((exp, expIndex) => (
          <div key={expIndex} className={classes.experienceModalItem}>
            <div className={classes.itemHeader}>
              <h4>Experience {expIndex + 1}</h4>
              <Button
                type="secondary"
                onClick={() => removeExperience(expIndex)}
                disabled={isLoading}
              >
                <Icon iconName="trash" />
              </Button>
            </div>

            <div className={classes.formGrid}>
              <Input
                id={`exp-position-${expIndex}`}
                type="text"
                label="Position"
                value={exp.position}
                onChange={(value) =>
                  updateExperience(expIndex, "position", value as string)
                }
                disabled={isLoading}
              />
              <Input
                id={`exp-company-${expIndex}`}
                type="text"
                label="Company"
                value={exp.company}
                onChange={(value) =>
                  updateExperience(expIndex, "company", value as string)
                }
                disabled={isLoading}
              />
              <Input
                id={`exp-location-${expIndex}`}
                type="text"
                label="Location"
                value={exp.location}
                onChange={(value) =>
                  updateExperience(expIndex, "location", value as string)
                }
                disabled={isLoading}
              />
              <Input
                id={`exp-url-${expIndex}`}
                type="text"
                label="Company URL"
                value={exp.url || ""}
                onChange={(value) =>
                  updateExperience(expIndex, "url", value as string)
                }
                disabled={isLoading}
              />
              <Input
                id={`exp-start-${expIndex}`}
                type="date"
                label="Start Date"
                value={exp.startDate}
                onChange={(value) =>
                  updateExperience(expIndex, "startDate", value as string)
                }
                disabled={isLoading}
              />
              <Input
                id={`exp-end-${expIndex}`}
                type="date"
                label="End Date"
                value={exp.endDate || ""}
                onChange={(value) =>
                  updateExperience(expIndex, "endDate", value as string)
                }
                disabled={isLoading}
              />
            </div>

            <div className={classes.summariesSection}>
              <div className={classes.summariesHeader}>
                <h5>Job Responsibilities & Achievements</h5>
                <Button
                  type="secondary"
                  onClick={() => addSummary(expIndex)}
                  disabled={isLoading}
                >
                  <Icon iconName="plus" />
                  Add Summary
                </Button>
              </div>

              {exp.summaries.map((summary, summaryIndex) => (
                <div key={summaryIndex} className={classes.summaryItem}>
                  <div className={classes.summaryHeader}>
                    <span>Summary {summaryIndex + 1}</span>
                    <Button
                      type="secondary"
                      onClick={() => removeSummary(expIndex, summaryIndex)}
                      disabled={isLoading}
                    >
                      <Icon iconName="trash" />
                    </Button>
                  </div>

                  <Input
                    id={`summary-text-${expIndex}-${summaryIndex}`}
                    type="textarea"
                    label="Description"
                    value={summary.text}
                    onChange={(value) =>
                      updateSummary(
                        expIndex,
                        summaryIndex,
                        "text",
                        value as string,
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
                      {summary.technologies.map((tech, techIndex) => (
                        <div key={techIndex} className={classes.techTag}>
                          <span>{tech}</span>
                          <button
                            type="button"
                            onClick={() =>
                              removeTechnology(
                                expIndex,
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
                        id={`new-tech-${expIndex}-${summaryIndex}`}
                        type="text"
                        label="Add Technology"
                        placeholder="e.g., React, Node.js"
                        value={
                          newTechnology[`${expIndex}-${summaryIndex}`] || ""
                        }
                        onChange={(value) =>
                          setNewTechnology({
                            ...newTechnology,
                            [`${expIndex}-${summaryIndex}`]: value as string,
                          })
                        }
                        disabled={isLoading}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addTechnology(expIndex, summaryIndex);
                          }
                        }}
                      />
                      <Button
                        type="secondary"
                        onClick={() => addTechnology(expIndex, summaryIndex)}
                        disabled={
                          !newTechnology[
                            `${expIndex}-${summaryIndex}`
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
          <Button type="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="primary" onClick={onClose}>
            Save Changes
          </Button>
        </div>
      </div>
    </Modal>
  );
}
