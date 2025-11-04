import type { TextareaHTMLAttributes } from "react";
import styles from "./Textarea.module.scss";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  id: string;
  error?: string;
}

export default function Textarea({
  label,
  id,
  error,
  ...props
}: TextareaProps) {
  return (
    <div className={styles.textareaWrapper}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <textarea
        id={id}
        className={`${styles.textarea} ${error ? styles.textareaError : ""}`}
        {...props}
      />
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}
