import type { ComponentProps } from "react";
import Icon from "../Icon/Icon";
import classes from "./Input.module.scss";

type BaseInputProps = {
  id: string;
  label?: string;
  placeholder?: string;
  value: string | number | undefined;
  onChange: (value: string | number) => void;
  onBlur?: () => void;
  error?: boolean | string;
  className?: string;
  style?: React.CSSProperties;
};

type TextInputProps = BaseInputProps & {
  type?: "text" | "password" | "email" | "tel";
  leftIcon?: string;
  rightIcon?: string;
  prefix?: string;
  suffix?: string;
} & Omit<
    ComponentProps<"input">,
    "id" | "value" | "onChange" | "onBlur" | "className" | "style"
  >;

type NumberInputProps = BaseInputProps & {
  type: "number";
} & Omit<
    ComponentProps<"input">,
    "id" | "value" | "onChange" | "onBlur" | "className" | "style" | "type"
  >;

type DateInputProps = BaseInputProps & {
  type: "date";
} & Omit<
    ComponentProps<"input">,
    "id" | "value" | "onChange" | "onBlur" | "className" | "style" | "type"
  >;

type TextareaProps = BaseInputProps & {
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
    if (type === "textarea" || type === "text") return "25rem";
    return "14 rem";
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (type === "number") {
      const num = e.target.value === "" ? "" : Number(e.target.value);
      onChange(num);
    } else {
      onChange(e.target.value);
    }
  };

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
            value={value}
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
            value={value || ""}
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

      {error && <span className={classes.error}>Invalid input</span>}
    </div>
  );
}
