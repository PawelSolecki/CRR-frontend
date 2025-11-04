import Icon from "@shared/components/Icon/Icon";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import classes from "./Modal.module.scss";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "small" | "medium" | "large";
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "medium",
}: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div className={classes.overlay} onClick={handleBackdropClick}>
      <div className={`${classes.modal} ${classes[size]}`}>
        <div className={classes.header}>
          <h2 className={classes.title}>{title}</h2>
          <button
            type="button"
            className={classes.closeButton}
            onClick={onClose}
            aria-label="Close modal"
          >
            <Icon iconName="x" />
          </button>
        </div>
        <div className={classes.content}>{children}</div>
      </div>
    </div>,
    document.body,
  );
}
