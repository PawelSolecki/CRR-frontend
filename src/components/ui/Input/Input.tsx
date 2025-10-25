import type { ComponentProps } from "react";
import Icon from "../Icon/Icon";
import classes from "./Input.module.scss";

type BaseInputProps<T> = {
  id: string;
  label?: string;
  placeholder?: string;
  value: T;
  onChange: (value: T) => void;
  onBlur?: () => void;
  error?: boolean | string;
  className?: string;
  style?: React.CSSProperties;
};

type TextInputProps = BaseInputProps<string> & {
  type?: "text" | "password" | "email" | "tel";
  leftIcon?: string;
  rightIcon?: string;
  prefix?: string;
  suffix?: string;
} & Omit<
    ComponentProps<"input">,
    "id" | "value" | "onChange" | "onBlur" | "className" | "style"
  >;

type NumberInputProps = BaseInputProps<number | string> & {
  type: "number";
} & Omit<
    ComponentProps<"input">,
    "id" | "value" | "onChange" | "onBlur" | "className" | "style" | "type"
  >;

type DateInputProps = BaseInputProps<string> & {
  type: "date";
} & Omit<
    ComponentProps<"input">,
    "id" | "value" | "onChange" | "onBlur" | "className" | "style" | "type"
  >;

type TextareaProps = BaseInputProps<string> & {
  type: "textarea";
  rows?: number;
} & Omit<
    ComponentProps<"textarea">,
    "id" | "value" | "onChange" | "onBlur" | "className" | "style" | "rows"
  >;

type InputProps =
  | TextInputProps
  | NumberInputProps
  | DateInputProps
  | TextareaProps;

export default function Input(props: InputProps) {
  const {
    id,
    label,
    placeholder,
    type = "text",
    value,
    onChange,
    onBlur,
    error,
    className,
    style,
    ...restProps
  } = props;

  const name = restProps.name || id;

  const getWidth = () => {
    if (type === "number") return "8rem";
    if (type === "textarea" || type === "text") return "20rem";
    return "14rem";
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (type === "number") {
      const numValue = e.target.value === "" ? "" : Number(e.target.value);
      (onChange as (value: number | string) => void)(numValue);
    } else {
      (onChange as (value: string) => void)(e.target.value);
    }
  };

  const displayValue = value ?? "";

  return (
    <div style={{ width: getWidth(), ...style }} className={className}>
      <label className={classes.label} htmlFor={id}>
        {label || "\u00A0"}
      </label>

      <div className={classes.inputWrapper}>
        {"leftIcon" in props && props.leftIcon && (
          <Icon iconName={props.leftIcon} />
        )}
        {"prefix" in props && props.prefix && (
          <span className={classes.prefix}>{props.prefix}</span>
        )}

        {type === "textarea" ? (
          <textarea
            id={id}
            name={name}
            value={displayValue}
            onChange={handleChange}
            onBlur={onBlur}
            placeholder={placeholder}
            className={`${classes.input} ${classes.textarea}`}
            rows={"rows" in props ? props.rows : 4}
            {...(restProps as ComponentProps<"textarea">)}
          />
        ) : (
          <input
            id={id}
            name={name}
            type={type}
            value={displayValue}
            onChange={handleChange}
            onBlur={onBlur}
            placeholder={placeholder}
            className={classes.input}
            {...(restProps as ComponentProps<"input">)}
          />
        )}

        {"suffix" in props && props.suffix && (
          <span className={classes.suffix}>{props.suffix}</span>
        )}
        {"rightIcon" in props && props.rightIcon && (
          <Icon iconName={props.rightIcon} />
        )}
      </div>

      {error && (
        <span className={classes.error}>
          {typeof error === "string" ? error : "Invalid input"}
        </span>
      )}
    </div>
  );
}
