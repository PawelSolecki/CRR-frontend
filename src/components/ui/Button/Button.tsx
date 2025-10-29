// import { useTheme } from "@hooks/useTheme";
import { Link } from "react-router-dom";
import Icon from "../Icon/Icon";
import classes from "./Button.module.scss";

export default function Button({
  text,
  link,
  type,
  iconLeft,
  iconRight,
  onClick,
  disabled = false,
  styles,
  children,
  buttonType = "button",
}: {
  text?: string;
  link?: string;
  type: "primary" | "secondary";
  iconLeft?: string;
  iconRight?: string;
  onClick?: () => void;
  disabled?: boolean;
  styles?: React.CSSProperties;
  children?: React.ReactNode;
  buttonType?: "button" | "submit" | "reset";
}) {
  const buttonClass = `${classes.button} ${classes[`button-${type}`]}`;
  // const { theme } = useTheme();

  const getIconColor = () => {
    // switch (type) {
    //   case "primary":
    //     return theme === "light" ? "#F6F6F6" : "#121212";
    //   case "secondary":
    //     return theme === "light" ? "#4d869c" : "#1d6d8d";
    //   case "transparent":
    //     return theme === "light" ? "#4d869c" : "#1d6d8d";
    //   case "warning":
    //     return theme === "light" ? "#ff6b6b" : "#d64545";
    //   default:
    //     return "#4d869c";
    // }
    return "#4d869c";
  };

  if (link) {
    return (
      <Link to={link} style={styles} onClick={onClick}>
        <button className={buttonClass} type={buttonType} disabled={disabled}>
          {iconLeft && (
            <Icon iconName={iconLeft} color={getIconColor()} size={15} />
          )}
          {text && <span className={classes.text}>{text}</span>}
          {iconRight && (
            <Icon iconName={iconRight} color={getIconColor()} size={15} />
          )}
          {children}
        </button>
      </Link>
    );
  }
  return (
    <button
      className={buttonClass + (disabled ? ` ${classes.disabled}` : "")}
      type={buttonType}
      style={styles}
      onClick={onClick}
      disabled={disabled}
    >
      {iconLeft && (
        <Icon iconName={iconLeft} color={getIconColor()} size={15} />
      )}
      {text && <span className={classes.text}>{text}</span>}
      {iconRight && (
        <Icon iconName={iconRight} color={getIconColor()} size={15} />
      )}
      {children}
    </button>
  );
}
