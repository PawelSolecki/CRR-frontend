import Button from "@shared/components/Button/Button";
import Icon from "@shared/components/Icon/Icon";
import classes from "../ReviewCVForm.module.scss";

interface CVSectionProps {
  title: string;
  itemCount?: number;
  onEdit: () => void;
  children: React.ReactNode;
  isReadOnly?: boolean;
  readOnlyMessage?: string;
}

export default function CVSection({
  title,
  itemCount,
  onEdit,
  children,
  isReadOnly = false,
  readOnlyMessage,
}: CVSectionProps) {
  return (
    <div className={classes.sectionCard}>
      <div className={classes.cardHeader}>
        <h2 className={classes.sectionTitle}>
          {title}
          {isReadOnly && (
            <span className={classes.readOnlyBadge}>Read Only</span>
          )}
        </h2>
        <Button
          type="secondary"
          onClick={onEdit}
          className={classes.editButton}
        >
          <Icon iconName="edit" />
          Edit {itemCount !== undefined && `(${itemCount})`}
        </Button>
      </div>
      <div className={classes.cardContent}>
        {children}
        {isReadOnly && readOnlyMessage && (
          <small className={classes.readOnlyNote}>{readOnlyMessage}</small>
        )}
      </div>
    </div>
  );
}
