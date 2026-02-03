import { Zap } from "lucide-react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
  variant?: "default" | "light";
}

export const Logo = ({
  size = "md",
  showText = true,
  className = "",
  variant = "default",
}: LogoProps) => {
  const sizeMap = {
    sm: { iconSize: 20, text: "text-lg" },
    md: { iconSize: 28, text: "text-xl" },
    lg: { iconSize: 36, text: "text-2xl" },
  };

  const currentSize = sizeMap[size];

  const colors = {
    default: {
      iconColor: "text-emerald-600",
      textColor: "text-gray-900",
    },
    light: {
      iconColor: "text-white",
      textColor: "text-white",
    },
  };

  const colorScheme = colors[variant];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`${colorScheme.iconColor}`}>
        <Zap size={currentSize.iconSize} fill="currentColor" />
      </div>
      {showText && (
        <span className={`font-bold ${currentSize.text} ${colorScheme.textColor}`}>
          devHelp
        </span>
      )}
    </div>
  );
};
