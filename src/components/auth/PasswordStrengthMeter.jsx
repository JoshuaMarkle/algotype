import { cn } from "@/lib/utils";

const strengthClasses = ["bg-red", "bg-yellow", "bg-green", "bg-green-2"];

/**
 * PasswordStrengthMeter – visual bar representation.
 * - All shown bars share the same color based on overall strength.
 * - Hidden when password is empty, with smooth transition.
 * - Displays textual label underneath.
 * @param {string} password - raw password to score
 * @param {string} [className] - additional Tailwind classes
 */
export default function PasswordStrengthMeter({ password = "", className }) {
  const { score, label } = evaluatePasswordStrength(password);
  const color = strengthClasses[score];
  const visible = password.length > 0;

  return (
    <div
      className={cn(
        "transition-all duration-300 ease-out overflow-hidden",
        visible ? "opacity-100 max-h-12" : "opacity-0 max-h-0",
        className,
      )}
    >
      {/* Bars */}
      <div className="flex gap-1" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={cn(
              "h-2 flex-1 rounded transition-colors",
              i <= score ? color : "bg-bg-2",
            )}
          />
        ))}
      </div>
      {/* Label */}
      <p className="text-xs mt-1 text-fg-2 font-medium">{label}</p>
    </div>
  );
}

/**
 * Evaluate password strength.
 * Levels
 * 0 – Very Weak: < 6 chars.
 * 1 – Weak: ≥ 6 but < 8 chars OR < 3 character-sets.
 * 2 – Good: ≥ 8 chars & contains lowercase, uppercase & digit.
 * 3 – Strong: ≥ 12 chars & contains lowercase, uppercase, digit & special.
 */
export function evaluatePasswordStrength(password = "") {
  const length = password.length;
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const charSets = [hasLower, hasUpper, hasNumber, hasSpecial].filter(
    Boolean,
  ).length;

  if (length < 6) {
    return { score: 0, label: "Very Weak" };
  }
  if (length < 8 || charSets < 3) {
    return { score: 1, label: "Weak" };
  }
  if (length >= 12 && charSets === 4) {
    return { score: 3, label: "Strong" };
  }
  return { score: 2, label: "Good" };
}
