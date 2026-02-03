import { Check, X } from "lucide-react";
interface PasswordRequirement {
  label: string;
  met: boolean;
}
interface PasswordStrengthIndicatorProps {
  password: string;
}
export const PasswordStrengthIndicator = ({
  password,
}: PasswordStrengthIndicatorProps) => {
  const passwordRequirements: PasswordRequirement[] = [
    {
      label: "At least 8 characters",
      met: password.length >= 8,
    },
    {
      label: "One uppercase letter",
      met: /[A-Z]/.test(password),
    },
    {
      label: "One lowercase letter",
      met: /[a-z]/.test(password),
    },
    {
      label: "One number",
      met: /\d/.test(password),
    },
    {
      label: "One special character (@$!%*?&)",
      met: /[@$!%*?&]/.test(password),
    },
  ];
  const passwordStrength = passwordRequirements.filter((req) => req.met).length;
  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 2) return "bg-red-500";
    if (passwordStrength <= 3) return "bg-orange-500";
    if (passwordStrength <= 4) return "bg-yellow-500";
    return "bg-green-500";
  };
  const getPasswordStrengthText = () => {
    if (passwordStrength <= 2) return "Weak";
    if (passwordStrength <= 3) return "Fair";
    if (passwordStrength <= 4) return "Good";
    return "Strong";
  };
  if (password.length === 0) {
    return null;
  }
  return (
    <div className="mt-2 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          Password Strength:
        </span>
        <span
          className={`text-xs font-semibold ${
            passwordStrength <= 2
              ? "text-red-600"
              : passwordStrength <= 3
                ? "text-orange-600"
                : passwordStrength <= 4
                  ? "text-yellow-600"
                  : "text-green-600"
          }`}
        >
          {getPasswordStrengthText()}
        </span>
      </div>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              level <= passwordStrength
                ? getPasswordStrengthColor()
                : "bg-gray-200"
            }`}
          />
        ))}
      </div>
      <div className="space-y-1 mt-2">
        {passwordRequirements.map((req, index) => (
          <div key={index} className="flex items-center gap-2 text-xs">
            {req.met ? (
              <Check className="h-3.5 w-3.5 text-green-600" />
            ) : (
              <X className="h-3.5 w-3.5 text-gray-400" />
            )}
            <span
              className={
                req.met ? "text-green-700 font-medium" : "text-muted-foreground"
              }
            >
              {req.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
