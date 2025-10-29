import type { Education } from "../../../../api/career-service/types.gen";
import Button from "../../../../components/ui/Button/Button";
import Icon from "../../../../components/ui/Icon/Icon";
import Input from "../../../../components/ui/Input/Input";
import Modal from "../../../../components/ui/Modal/Modal";
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
  const updateEducation = (
    index: number,
    field: keyof Education,
    value: string,
  ) => {
    const updated = education.map((edu, i) =>
      i === index ? { ...edu, [field]: value } : edu,
    );
    onUpdate(updated);
  };

  const addEducation = () => {
    const newEducation: Education = {
      school: "",
      degree: "",
      fieldOfStudy: "",
      startDate: "",
      endDate: "",
    };
    onUpdate([...education, newEducation]);
  };

  const removeEducation = (index: number) => {
    onUpdate(education.filter((_, i) => i !== index));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
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

        {education.map((edu, index) => (
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
                value={edu.school}
                onChange={(value) =>
                  updateEducation(index, "school", value as string)
                }
                disabled={isLoading}
                style={{ gridColumn: "1 / -1" }}
              />
              <Input
                id={`education-degree-${index}`}
                type="text"
                label="Degree"
                value={edu.degree}
                onChange={(value) =>
                  updateEducation(index, "degree", value as string)
                }
                disabled={isLoading}
              />
              <Input
                id={`education-field-${index}`}
                type="text"
                label="Field of Study"
                value={edu.fieldOfStudy}
                onChange={(value) =>
                  updateEducation(index, "fieldOfStudy", value as string)
                }
                disabled={isLoading}
              />
              <Input
                id={`education-start-${index}`}
                type="date"
                label="Start Date"
                value={edu.startDate}
                onChange={(value) =>
                  updateEducation(index, "startDate", value as string)
                }
                disabled={isLoading}
              />
              <Input
                id={`education-end-${index}`}
                type="date"
                label="End Date"
                value={edu.endDate || ""}
                onChange={(value) =>
                  updateEducation(index, "endDate", value as string)
                }
                disabled={isLoading}
              />
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
