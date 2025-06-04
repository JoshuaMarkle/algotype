import * as React from "react";

import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

export function Keyboard() {
  const rows = [
    [
      "`",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "0",
      "-",
      "=",
      "Backspace",
    ],
    ["Tab", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]", "\\"],
    ["Caps", "A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'", "Enter"],
    ["Shift", "Z", "X", "C", "V", "B", "N", "M", ",", ".", "/", "Shift"],
    ["Ctrl", "Win", "Alt", "Space", "Alt", "Fn", "Menu", "Ctrl"],
  ];

  const getKeySize = (key) => {
    // Add width scaling for special keys
    const wideKeys = {
      Backspace: "w-22",
      Tab: "w-16",
      Caps: "w-20",
      Enter: "w-24",
      Shift: "w-28",
      Ctrl: "w-16",
      Alt: "w-14",
      Space: "flex-1",
      Win: "w-14",
      Fn: "w-12",
      Menu: "w-14",
      "\\": "w-16",
    };
    return wideKeys[key] || "w-10";
  };

  return (
    <div className="inline-flex flex-col gap-2 m-4">
      {rows.map((row, i) => (
        <div key={i} className="flex gap-2">
          {row.map((key, j) => (
            <Kbd
              key={j}
              className={getKeySize(key)}
              variant="keyboard"
              size="lg"
            >
              {key === "Space" ? "" : key}
            </Kbd>
          ))}
        </div>
      ))}
    </div>
  );
}

const kbdVariants = cva(
  "pointer-events-none inline-flex select-none justify-center items-center gap-2 rounded-sm font-mono text-[10px] font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-bg-2 text-foreground border",
        secondary:
          "bg-secondary text-secondary-foreground shadow-[inset_0_-2px_0_0_var(--shadow-color)] shadow-secondary-foreground/60",
        keyboard: "text-fg-4 border border-border-subtle hover:bg-bg-3",
      },
      size: {
        default: "px-1.5 py-0.5 ",
        lg: "text-sm px-4 py-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Kbd({ className, variant, size, asChild = false, ...props }) {
  const Comp = asChild ? Slot : "kbd";

  return (
    <Comp
      data-slot="kbd"
      className={cn(kbdVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export default Kbd;
export { Kbd, kbdVariants };
