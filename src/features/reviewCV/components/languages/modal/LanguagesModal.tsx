import type { Language } from "@api/career-service/types.gen";
import Button from "@shared/components/Button/Button";
import Icon from "@shared/components/Icon/Icon";
import Input from "@shared/components/Input/Input";
import Modal from "@shared/components/Modal/Modal";
import { useCallback, useEffect, useState } from "react";
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
  const [localLanguages, setLocalLanguages] = useState<Language[]>([]);

  // Initialize local state when modal opens
  useEffect(() => {
    if (isOpen) {
      setLocalLanguages([...languages]);
    }
  }, [isOpen, languages]);

  const updateLanguage = useCallback(
    (index: number, field: keyof Language, value: string) => {
      setLocalLanguages((prev) =>
        prev.map((lang, i) =>
          i === index ? { ...lang, [field]: value } : lang,
        ),
      );
    },
    [],
  );

  const addLanguage = useCallback(() => {
    const newLanguage: Language = {
      language: "",
      level: "A1",
    };
    setLocalLanguages((prev) => [...prev, newLanguage]);
  }, []);

  const removeLanguage = useCallback((index: number) => {
    setLocalLanguages((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleSave = useCallback(() => {
    onUpdate(localLanguages);
    onClose();
  }, [localLanguages, onUpdate, onClose]);

  const handleCancel = useCallback(() => {
    setLocalLanguages([...languages]); // Reset to original
    onClose();
  }, [languages, onClose]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
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

        {localLanguages.map((lang, index) => (
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
                value={lang.language || ""}
                onChange={(e) =>
                  updateLanguage(index, "language", e.target.value)
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
                  value={lang.level || "A1"}
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
