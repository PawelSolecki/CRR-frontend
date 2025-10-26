import { useState } from "react";
import styles from "./AddTechnologyInput.module.scss";

interface AddTechnologyInputProps {
  onAdd: (technology: string) => void;
}

export default function AddTechnologyInput({ onAdd }: AddTechnologyInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedValue = inputValue.trim();
    if (trimmedValue) {
      onAdd(trimmedValue);
      setInputValue("");
    }
  };

  const handleBlur = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue) {
      onAdd(trimmedValue);
      setInputValue("");
    }
  };

  return (
    <form className={styles.addTechnologyForm} onSubmit={handleSubmit}>
      <input
        type="text"
        className={styles.input}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onBlur={handleBlur}
        placeholder="Add technology..."
        autoFocus
      />
    </form>
  );
}
