import type { Language } from "@api/career-service/types.gen";
import Button from "@shared/components/Button/Button";
import Icon from "@shared/components/Icon/Icon";
import Input from "@shared/components/Input/Input";
import Modal from "@shared/components/Modal/Modal";
import classes from "./LanguagesModal.module.scss";

interface LanguagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  languages: Language[];
  onUpdate: (languages: Language[]) => void;
  isLoading?: boolean;
}

export default function LanguagesModal({
  isOpen,
  onClose,
  languages,
  onUpdate,
  isLoading = false,
}: LanguagesModalProps) {
  const updateLanguage = (
    index: number,
    field: keyof Language,
    value: string,
  ) => {
    const updated = languages.map((lang, i) =>
      i === index ? { ...lang, [field]: value } : lang,
    );
    onUpdate(updated);
  };

  const addLanguage = () => {
    const newLanguage: Language = {
      language: "",
      level: "A1",
    };
    onUpdate([...languages, newLanguage]);
  };

  const removeLanguage = (index: number) => {
    onUpdate(languages.filter((_, i) => i !== index));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Languages"
      size="medium"
    >
      <div className={classes.modalContent}>
        <div className={classes.sectionHeader}>
          <h3>Language Proficiencies</h3>
          <Button type="secondary" onClick={addLanguage} disabled={isLoading}>
            <Icon iconName="plus" />
            Add Language
          </Button>
        </div>

        {languages.map((lang, index) => (
          <div key={index} className={classes.languageItem}>
            <div className={classes.itemHeader}>
              <h4>Language {index + 1}</h4>
              <Button
                type="secondary"
                onClick={() => removeLanguage(index)}
                disabled={isLoading}
              >
                <Icon iconName="trash" />
              </Button>
            </div>
            <div className={classes.formGrid}>
              <Input
                id={`language-name-${index}`}
                type="text"
                label="Language"
                value={lang.language}
                onChange={(value) =>
                  updateLanguage(index, "language", value as string)
                }
                style={{ width: "100%" }}
                disabled={isLoading}
              />
              <div className={classes.selectWrapper}>
                <label
                  htmlFor={`language-level-${index}`}
                  className={classes.selectLabel}
                >
                  Proficiency Level
                </label>
                <select
                  id={`language-level-${index}`}
                  value={lang.level}
                  onChange={(e) =>
                    updateLanguage(index, "level", e.target.value)
                  }
                  disabled={isLoading}
                  className={classes.select}
                >
                  <option value="A1">A1 - Beginner</option>
                  <option value="A2">A2 - Elementary</option>
                  <option value="B1">B1 - Intermediate</option>
                  <option value="B2">B2 - Upper Intermediate</option>
                  <option value="C1">C1 - Advanced</option>
                  <option value="C2">C2 - Proficient</option>
                </select>
              </div>
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
