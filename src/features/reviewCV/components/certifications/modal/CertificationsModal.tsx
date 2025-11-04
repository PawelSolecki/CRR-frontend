import type { Certification } from "@api/career-service/types.gen";
import Button from "@shared/components/Button/Button";
import Icon from "@shared/components/Icon/Icon";
import Input from "@shared/components/Input/Input";
import Modal from "@shared/components/Modal/Modal";
import { useEffect, useState } from "react";
import classes from "./CertificationsModal.module.scss";

interface CertificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  certifications: Certification[];
  onUpdate: (certifications: Certification[]) => void;
  isLoading?: boolean;
}

export default function CertificationsModal({
  isOpen,
  onClose,
  certifications,
  onUpdate,
  isLoading = false,
}: CertificationsModalProps) {
  const [localCertifications, setLocalCertifications] = useState<
    Certification[]
  >([]);

  // Initialize when modal opens
  useEffect(() => {
    if (isOpen) {
      setLocalCertifications([...certifications]);
    }
  }, [isOpen, certifications]);

  const updateCertification = (
    index: number,
    field: keyof Certification,
    value: string,
  ) => {
    setLocalCertifications((prev) =>
      prev.map((cert, i) => (i === index ? { ...cert, [field]: value } : cert)),
    );
  };

  const addCertification = () => {
    setLocalCertifications((prev) => [
      ...prev,
      { name: "", issuer: "", date: "" },
    ]);
  };

  const removeCertification = (index: number) => {
    setLocalCertifications((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onUpdate(localCertifications);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title="Edit Certifications"
      size="large"
    >
      <div className={classes.modalContent}>
        <div className={classes.sectionHeader}>
          <h3>Professional Certifications</h3>
          <Button
            type="secondary"
            onClick={addCertification}
            disabled={isLoading}
          >
            <Icon iconName="plus" />
            Add Certification
          </Button>
        </div>

        {localCertifications.map((cert, index) => (
          <div key={index} className={classes.certificationItem}>
            <div className={classes.itemHeader}>
              <h4>Certification {index + 1}</h4>
              <Button
                type="secondary"
                onClick={() => removeCertification(index)}
                disabled={isLoading}
              >
                <Icon iconName="trash" />
              </Button>
            </div>
            <div className={classes.formGrid}>
              <Input
                id={`cert-name-${index}`}
                type="text"
                label="Certification Name"
                value={cert.name || ""}
                onChange={(e) =>
                  updateCertification(index, "name", e.target.value)
                }
                disabled={isLoading}
                style={{ gridColumn: "1 / -1" }}
              />
              <Input
                id={`cert-issuer-${index}`}
                type="text"
                label="Issuing Organization"
                value={cert.issuer || ""}
                onChange={(e) =>
                  updateCertification(index, "issuer", e.target.value)
                }
                disabled={isLoading}
              />
              <Input
                id={`cert-date-${index}`}
                type="date"
                label="Issue Date"
                value={cert.date || ""}
                onChange={(e) =>
                  updateCertification(index, "date", e.target.value)
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
