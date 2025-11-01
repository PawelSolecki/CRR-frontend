import type { PersonalInfo } from "@api/career-service/types.gen";
import Button from "@shared/components/Button/Button";
import Input from "@shared/components/Input/Input";
import Modal from "@shared/components/Modal/Modal";
import { useCallback, useEffect, useState } from "react";
import classes from "./PersonalInfoModal.module.scss";

interface PersonalInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  personalInfo: PersonalInfo;
  onUpdate: (field: keyof PersonalInfo, value: string) => void;
  isLoading?: boolean;
}

export default function PersonalInfoModal({
  isOpen,
  onClose,
  personalInfo,
  onUpdate,
  isLoading = false,
}: PersonalInfoModalProps) {
  const [localPersonalInfo, setLocalPersonalInfo] =
    useState<PersonalInfo>(personalInfo);

  // Initialize local state when modal opens
  useEffect(() => {
    if (isOpen) {
      setLocalPersonalInfo({ ...personalInfo });
    }
  }, [isOpen, personalInfo]);

  const updateLocalField = useCallback(
    (field: keyof PersonalInfo, value: string) => {
      setLocalPersonalInfo((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    [],
  );

  const handleSave = useCallback(() => {
    // Update all fields in the parent
    Object.entries(localPersonalInfo).forEach(([field, value]) => {
      if (typeof value === "string") {
        onUpdate(field as keyof PersonalInfo, value);
      }
    });
    onClose();
  }, [localPersonalInfo, onUpdate, onClose]);

  const handleCancel = useCallback(() => {
    setLocalPersonalInfo({ ...personalInfo }); // Reset to original
    onClose();
  }, [personalInfo, onClose]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title="Edit Personal Information"
      size="large"
    >
      <div className={classes.modalContent}>
        <div className={classes.formGrid}>
          <Input
            id="firstName"
            type="text"
            label="First Name"
            value={localPersonalInfo.firstName || ""}
            onChange={(e) => updateLocalField("firstName", e.target.value)}
            disabled={isLoading}
          />
          <Input
            id="lastName"
            type="text"
            label="Last Name"
            value={localPersonalInfo.lastName || ""}
            onChange={(e) => updateLocalField("lastName", e.target.value)}
            disabled={isLoading}
          />
          <Input
            id="email"
            type="email"
            label="Email"
            value={localPersonalInfo.email || ""}
            onChange={(e) => updateLocalField("email", e.target.value)}
            disabled={isLoading}
          />
          <Input
            id="phone"
            type="tel"
            label="Phone"
            value={localPersonalInfo.phone || ""}
            onChange={(e) => updateLocalField("phone", e.target.value)}
            disabled={isLoading}
          />
          <Input
            id="role"
            type="text"
            label="Professional Role"
            value={localPersonalInfo.role || ""}
            onChange={(e) => updateLocalField("role", e.target.value)}
            disabled={isLoading}
          />
          <Input
            id="summary"
            type="textarea"
            label="Professional Summary"
            value={localPersonalInfo.summary || ""}
            onChange={(e) => updateLocalField("summary", e.target.value)}
            disabled={isLoading}
          />
          <Input
            id="linkedIn"
            type="text"
            label="LinkedIn"
            value={localPersonalInfo.linkedIn || ""}
            onChange={(e) => updateLocalField("linkedIn", e.target.value)}
            disabled={isLoading}
          />
          <Input
            id="github"
            type="text"
            label="GitHub"
            value={localPersonalInfo.github || ""}
            onChange={(e) => updateLocalField("github", e.target.value)}
            disabled={isLoading}
          />
          <Input
            id="website"
            type="text"
            label="Website"
            value={localPersonalInfo.website || ""}
            onChange={(e) => updateLocalField("website", e.target.value)}
            disabled={isLoading}
          />
          <Input
            id="other"
            type="text"
            label="Other Information"
            value={localPersonalInfo.other || ""}
            onChange={(e) => updateLocalField("other", e.target.value)}
            disabled={isLoading}
          />
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
