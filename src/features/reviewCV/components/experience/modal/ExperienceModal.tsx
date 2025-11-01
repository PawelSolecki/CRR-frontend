import type { Experience, Summary } from "@api/career-service/types.gen";
import Button from "@shared/components/Button/Button";
import Icon from "@shared/components/Icon/Icon";
import Input from "@shared/components/Input/Input";
import Modal from "@shared/components/Modal/Modal";
import { useCallback, useEffect, useState } from "react";
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
  const [localExperience, setLocalExperience] = useState<Experience[]>([]);
  const [newTechnology, setNewTechnology] = useState<{ [key: string]: string }>(
    {},
  );

  // Initialize local state when modal opens
  useEffect(() => {
    if (isOpen) {
      setLocalExperience([...experience]);
      setNewTechnology({});
    }
  }, [isOpen, experience]);

  const updateExperience = useCallback(
    (index: number, field: keyof Experience, value: string) => {
      setLocalExperience((prev) =>
        prev.map((exp, i) => (i === index ? { ...exp, [field]: value } : exp)),
      );
    },
    [],
  );

  const updateSummary = useCallback(
    (
      expIndex: number,
      summaryIndex: number,
      field: keyof Summary,
      value: string | string[],
    ) => {
      setLocalExperience((prev) =>
        prev.map((exp, i) =>
          i === expIndex
            ? {
                ...exp,
                summaries:
                  exp.summaries?.map((summary, j) =>
                    j === summaryIndex
                      ? { ...summary, [field]: value }
                      : summary,
                  ) || [],
              }
            : exp,
        ),
      );
    },
    [],
  );

  const addExperience = useCallback(() => {
    const newExp: Experience = {
      position: "",
      company: "",
      url: "",
      location: "",
      startDate: "",
      endDate: "",
      summaries: [{ text: "", technologies: [] }],
    };
    setLocalExperience((prev) => [...prev, newExp]);
  }, []);

  const removeExperience = useCallback((index: number) => {
    setLocalExperience((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const addSummary = useCallback((expIndex: number) => {
    setLocalExperience((prev) =>
      prev.map((exp, i) =>
        i === expIndex
          ? {
              ...exp,
              summaries: [
                ...(exp.summaries || []),
                { text: "", technologies: [] },
              ],
            }
          : exp,
      ),
    );
  }, []);

  const removeSummary = useCallback(
    (expIndex: number, summaryIndex: number) => {
      setLocalExperience((prev) =>
        prev.map((exp, i) =>
          i === expIndex
            ? {
                ...exp,
                summaries:
                  exp.summaries?.filter((_, j) => j !== summaryIndex) || [],
              }
            : exp,
        ),
      );
    },
    [],
  );

  const addTechnology = useCallback(
    (expIndex: number, summaryIndex: number) => {
      const key = `${expIndex}-${summaryIndex}`;
      const techValue = newTechnology[key]?.trim();

      if (techValue) {
        const currentTechnologies =
          localExperience[expIndex].summaries?.[summaryIndex].technologies ||
          [];
        if (!currentTechnologies.includes(techValue)) {
          updateSummary(expIndex, summaryIndex, "technologies", [
            ...currentTechnologies,
            techValue,
          ]);
          setNewTechnology((prev) => ({ ...prev, [key]: "" }));
        }
      }
    },
    [localExperience, newTechnology, updateSummary],
  );

  const removeTechnology = useCallback(
    (expIndex: number, summaryIndex: number, techIndex: number) => {
      const currentTechnologies =
        localExperience[expIndex].summaries?.[summaryIndex].technologies || [];
      updateSummary(
        expIndex,
        summaryIndex,
        "technologies",
        currentTechnologies.filter((_, i) => i !== techIndex),
      );
    },
    [localExperience, updateSummary],
  );

  const handleSave = useCallback(() => {
    onUpdate(localExperience);
    onClose();
  }, [localExperience, onUpdate, onClose]);

  const handleCancel = useCallback(() => {
    setLocalExperience([...experience]); // Reset to original
    setNewTechnology({});
    onClose();
  }, [experience, onClose]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
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

        {localExperience.map((exp, expIndex) => (
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
                value={exp.position || ""}
                onChange={(e) =>
                  updateExperience(expIndex, "position", e.target.value)
                }
                disabled={isLoading}
              />
              <Input
                id={`exp-company-${expIndex}`}
                type="text"
                label="Company"
                value={exp.company || ""}
                onChange={(e) =>
                  updateExperience(expIndex, "company", e.target.value)
                }
                disabled={isLoading}
              />
              <Input
                id={`exp-location-${expIndex}`}
                type="text"
                label="Location"
                value={exp.location || ""}
                onChange={(e) =>
                  updateExperience(expIndex, "location", e.target.value)
                }
                disabled={isLoading}
              />
              <Input
                id={`exp-url-${expIndex}`}
                type="text"
                label="Company URL"
                value={exp.url || ""}
                onChange={(e) =>
                  updateExperience(expIndex, "url", e.target.value)
                }
                disabled={isLoading}
              />
              <Input
                id={`exp-start-${expIndex}`}
                type="date"
                label="Start Date"
                value={exp.startDate || ""}
                onChange={(e) =>
                  updateExperience(expIndex, "startDate", e.target.value)
                }
                disabled={isLoading}
              />
              <Input
                id={`exp-end-${expIndex}`}
                type="date"
                label="End Date"
                value={exp.endDate || ""}
                onChange={(e) =>
                  updateExperience(expIndex, "endDate", e.target.value)
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

              {exp.summaries?.map((summary, summaryIndex) => (
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
                    value={summary.text || ""}
                    onChange={(e) =>
                      updateSummary(
                        expIndex,
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
                        onChange={(e) =>
                          setNewTechnology((prev) => ({
                            ...prev,
                            [`${expIndex}-${summaryIndex}`]: e.target.value,
                          }))
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
