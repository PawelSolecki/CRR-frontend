import type { Certification } from "../../../../api/career-service/types.gen";
import Button from "../../../../components/ui/Button/Button";
import Icon from "../../../../components/ui/Icon/Icon";
import Input from "../../../../components/ui/Input/Input";
import Modal from "../../../../components/ui/Modal/Modal";
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
  const updateCertification = (
    index: number,
    field: keyof Certification,
    value: string,
  ) => {
    const updated = certifications.map((cert, i) =>
      i === index ? { ...cert, [field]: value } : cert,
    );
    onUpdate(updated);
  };

  const addCertification = () => {
    const newCertification: Certification = {
      name: "",
      issuer: "",
      date: "",
    };
    onUpdate([...certifications, newCertification]);
  };

  const removeCertification = (index: number) => {
    onUpdate(certifications.filter((_, i) => i !== index));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
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

        {certifications.map((cert, index) => (
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
                value={cert.name}
                onChange={(value) =>
                  updateCertification(index, "name", value as string)
                }
                disabled={isLoading}
                style={{ gridColumn: "1 / -1" }}
              />
              <Input
                id={`cert-issuer-${index}`}
                type="text"
                label="Issuing Organization"
                value={cert.issuer}
                onChange={(value) =>
                  updateCertification(index, "issuer", value as string)
                }
                disabled={isLoading}
              />
              <Input
                id={`cert-date-${index}`}
                type="date"
                label="Issue Date"
                value={cert.date}
                onChange={(value) =>
                  updateCertification(index, "date", value as string)
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
