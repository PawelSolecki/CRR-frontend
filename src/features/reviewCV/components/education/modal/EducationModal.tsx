import type { Education } from "@api/career-service/types.gen";
import Button from "@shared/components/Button/Button";
import Icon from "@shared/components/Icon/Icon";
import Input from "@shared/components/Input/Input";
import Modal from "@shared/components/Modal/Modal";
import { useCallback, useEffect, useState } from "react";
import classes from "./EducationModal.module.scss";

interface EducationModalProps {
  isOpen: boolean;
  onClose: () => void;
  education: Education[];
  onUpdate: (education: Education[]) => void;
  isLoading?: boolean;
}

export default function EducationModal({
  isOpen,
  onClose,
  education,
  onUpdate,
  isLoading = false,
}: EducationModalProps) {
  const [localEducation, setLocalEducation] = useState<Education[]>([]);

  // Initialize local state when modal opens
  useEffect(() => {
    if (isOpen) {
      setLocalEducation([...education]);
    }
  }, [isOpen, education]);

  const updateEducation = useCallback(
    (index: number, field: keyof Education, value: string) => {
      setLocalEducation((prev) =>
        prev.map((edu, i) => (i === index ? { ...edu, [field]: value } : edu)),
      );
    },
    [],
  );

  const addEducation = useCallback(() => {
    const newEducation: Education = {
      school: "",
      degree: "",
      fieldOfStudy: "",
      startDate: "",
      endDate: "",
    };
    setLocalEducation((prev) => [...prev, newEducation]);
  }, []);

  const removeEducation = useCallback((index: number) => {
    setLocalEducation((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleSave = useCallback(() => {
    onUpdate(localEducation);
    onClose();
  }, [localEducation, onUpdate, onClose]);

  const handleCancel = useCallback(() => {
    setLocalEducation([...education]); // Reset to original
    onClose();
  }, [education, onClose]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title="Edit Education"
      size="large"
    >
      <div className={classes.modalContent}>
        <div className={classes.sectionHeader}>
          <h3>Education History</h3>
          <Button type="secondary" onClick={addEducation} disabled={isLoading}>
            <Icon iconName="plus" />
            Add Education
          </Button>
        </div>

        {localEducation.map((edu, index) => (
          <div key={index} className={classes.educationItem}>
            <div className={classes.itemHeader}>
              <h4>Education {index + 1}</h4>
              <Button
                type="secondary"
                onClick={() => removeEducation(index)}
                disabled={isLoading}
              >
                <Icon iconName="trash" />
              </Button>
            </div>
            <div className={classes.formGrid}>
              <Input
                id={`education-school-${index}`}
                type="text"
                label="School/University"
                value={edu.school || ""}
                onChange={(e) =>
                  updateEducation(index, "school", e.target.value)
                }
                disabled={isLoading}
                style={{ gridColumn: "1 / -1" }}
              />
              <Input
                id={`education-degree-${index}`}
                type="text"
                label="Degree"
                value={edu.degree || ""}
                onChange={(e) =>
                  updateEducation(index, "degree", e.target.value)
                }
                disabled={isLoading}
              />
              <Input
                id={`education-field-${index}`}
                type="text"
                label="Field of Study"
                value={edu.fieldOfStudy || ""}
                onChange={(e) =>
                  updateEducation(index, "fieldOfStudy", e.target.value)
                }
                disabled={isLoading}
              />
              <Input
                id={`education-start-${index}`}
                type="date"
                label="Start Date"
                value={edu.startDate || ""}
                onChange={(e) =>
                  updateEducation(index, "startDate", e.target.value)
                }
                disabled={isLoading}
              />
              <Input
                id={`education-end-${index}`}
                type="date"
                label="End Date"
                value={edu.endDate || ""}
                onChange={(e) =>
                  updateEducation(index, "endDate", e.target.value)
                }
                disabled={isLoading}
              />
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
