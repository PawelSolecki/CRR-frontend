import { useState } from "react";
import Button from "../../../../components/ui/Button/Button";
import Icon from "../../../../components/ui/Icon/Icon";
import Input from "../../../../components/ui/Input/Input";
import Modal from "../../../../components/ui/Modal/Modal";
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
  const [newSkill, setNewSkill] = useState("");

  const handleAddSkill = () => {
    if (
      newSkill.trim() &&
      !skills.some((skill) => skill.toLowerCase() === newSkill.toLowerCase())
    ) {
      onUpdate([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (index: number) => {
    onUpdate(skills.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Skills" size="large">
      <div className={classes.modalContent}>
        <div className={classes.sectionHeader}>
          <h3>Professional Skills</h3>
          <span className={classes.skillCount}>{skills.length} skills</span>
        </div>

        <div className={classes.skillsGrid}>
          {skills.map((skill, index) => (
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
              onChange={(value) => setNewSkill(value as string)}
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
