import { useId } from "react";
import { cn } from "@/lib/utils";

export default function HashPatternSvg({ className, ...props }) {
  const patternId = useId();

  return (
    <svg
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 size-full select-none stroke-border text-primary",
        className,
      )}
      {...props}
    >
      <defs>
        <pattern
          id={patternId}
          width="8"
          height="4"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <line x1="0" y1="0" x2="0" y2="4" strokeWidth="1.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}
