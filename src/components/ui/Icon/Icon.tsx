import * as LucideIcons from "lucide-react";
// import { useTheme } from "../../../hooks/useTheme";

type IconProps = {
  iconName: string;
  size?: number;
  color?: string;
  styles?: React.CSSProperties;
  fill?: "none" | "yes";
};

export default function Icon({
  iconName,
  size = 20,
  color,
  styles,
  fill = "none",
}: IconProps) {
  const { theme } = useTheme();
  const defaultColor = theme === "light" ? "#2ec4b6" : "#2ec4b6";
  const normalizedIconName =
    iconName.charAt(0).toUpperCase() + iconName.slice(1);
  const IconComponent =
    LucideIcons[normalizedIconName as keyof typeof LucideIcons];
  const fillColor = fill === "yes" ? defaultColor : "none";

  if (!IconComponent) {
    const FallbackIcon = LucideIcons.HelpCircle;
    return (
      <FallbackIcon
        fill={fillColor}
        size={size}
        color={color || defaultColor}
        style={styles}
      />
    );
  }

  return (
    <IconComponent
      fill={fillColor}
      size={size}
      color={color || defaultColor}
      style={styles}
    />
  );
}
