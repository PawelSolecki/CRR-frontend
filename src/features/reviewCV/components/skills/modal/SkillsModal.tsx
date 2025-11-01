import Button from "@shared/components/Button/Button";
import Icon from "@shared/components/Icon/Icon";
import Input from "@shared/components/Input/Input";
import Modal from "@shared/components/Modal/Modal";
import { useCallback, useEffect, useState } from "react";
import classes from "./SkillsModal.module.scss";

interface SkillsModalProps {
  isOpen: boolean;
  onClose: () => void;
  skills: string[];
  onUpdate: (skills: string[]) => void;
  isLoading?: boolean;
}

export default function SkillsModal({
  isOpen,
  onClose,
  skills,
  onUpdate,
  isLoading = false,
}: SkillsModalProps) {
  const [localSkills, setLocalSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");

  // Initialize local state when modal opens
  useEffect(() => {
    if (isOpen) {
      setLocalSkills([...skills]);
      setNewSkill("");
    }
  }, [isOpen, skills]);

  const handleAddSkill = useCallback(() => {
    if (
      newSkill.trim() &&
      !localSkills.some(
        (skill) => skill.toLowerCase() === newSkill.toLowerCase(),
      )
    ) {
      setLocalSkills((prev) => [...prev, newSkill.trim()]);
      setNewSkill("");
    }
  }, [newSkill, localSkills]);

  const handleRemoveSkill = useCallback((index: number) => {
    setLocalSkills((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleAddSkill();
      }
    },
    [handleAddSkill],
  );

  const handleSave = useCallback(() => {
    onUpdate(localSkills);
    onClose();
  }, [localSkills, onUpdate, onClose]);

  const handleCancel = useCallback(() => {
    setLocalSkills([...skills]); // Reset to original
    setNewSkill("");
    onClose();
  }, [skills, onClose]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title="Edit Skills"
      size="large"
    >
      <div className={classes.modalContent}>
        <div className={classes.sectionHeader}>
          <h3>Professional Skills</h3>
          <span className={classes.skillCount}>
            {localSkills.length} skills
          </span>
        </div>

        <div className={classes.skillsGrid}>
          {localSkills.map((skill, index) => (
            <div key={index} className={classes.techTag}>
              <span>{skill}</span>
              <button
                type="button"
                className={classes.techRemoveButton}
                onClick={() => handleRemoveSkill(index)}
                disabled={isLoading}
              >
                <Icon iconName="x" />
              </button>
            </div>
          ))}
        </div>

        <div className={classes.addSkillSection}>
          <div className={classes.addSkillInput}>
            <Input
              id="newSkill"
              type="text"
              label="Add New Skill"
              placeholder="e.g., React, JavaScript, Project Management"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isLoading}
              style={{ width: "100%" }}
            />
          </div>
          <Button
            type="secondary"
            onClick={handleAddSkill}
            disabled={!newSkill.trim() || isLoading}
          >
            <Icon iconName="plus" />
            Add Skill
          </Button>
        </div>

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
