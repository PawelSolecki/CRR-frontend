import Button from "../../../../components/ui/Button/Button";
import Input from "../../../../components/ui/Input/Input";
import Modal from "../../../../components/ui/Modal/Modal";
import classes from "./PersonalInfoModal.module.scss";

import type { PersonalInfo } from "../../../../api/career-service/types.gen";

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
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Personal Information"
      size="large"
    >
      <div className={classes.modalContent}>
        <div className={classes.formGrid}>
          <Input
            id="firstName"
            type="text"
            label="First Name"
            value={personalInfo.firstName}
            onChange={(value) => onUpdate("firstName", value as string)}
            disabled={isLoading}
          />
          <Input
            id="lastName"
            type="text"
            label="Last Name"
            value={personalInfo.lastName}
            onChange={(value) => onUpdate("lastName", value as string)}
            disabled={isLoading}
          />
          <Input
            id="email"
            type="email"
            label="Email"
            value={personalInfo.email}
            onChange={(value) => onUpdate("email", value as string)}
            disabled={isLoading}
          />
          <Input
            id="phone"
            type="tel"
            label="Phone"
            value={personalInfo.phone}
            onChange={(value) => onUpdate("phone", value as string)}
            disabled={isLoading}
          />
          <Input
            id="role"
            type="text"
            label="Professional Role"
            value={personalInfo.role}
            onChange={(value) => onUpdate("role", value as string)}
            disabled={isLoading}
          />
          <Input
            id="summary"
            type="textarea"
            label="Professional Summary"
            value={personalInfo.summary}
            onChange={(value) => onUpdate("summary", value as string)}
            disabled={isLoading}
          />
          <Input
            id="linkedIn"
            type="text"
            label="LinkedIn"
            value={personalInfo.linkedIn || ""}
            onChange={(value) => onUpdate("linkedIn", value as string)}
            disabled={isLoading}
          />
          <Input
            id="github"
            type="text"
            label="GitHub"
            value={personalInfo.github || ""}
            onChange={(value) => onUpdate("github", value as string)}
            disabled={isLoading}
          />
          <Input
            id="website"
            type="text"
            label="Website"
            value={personalInfo.website || ""}
            onChange={(value) => onUpdate("website", value as string)}
            disabled={isLoading}
          />
          <Input
            id="other"
            type="text"
            label="Other Information"
            value={personalInfo.other || ""}
            onChange={(value) => onUpdate("other", value as string)}
            disabled={isLoading}
          />
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
