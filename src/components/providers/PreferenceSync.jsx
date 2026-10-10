"use client";

import { useEffect } from "react";

import { startPreferenceSync } from "@/lib/preferences";
import { onSettingsChange } from "@/lib/settings";
import { applyTheme } from "@/lib/themes";

// Mounted once in the root layout: keeps settings in sync with the account
// and applies a theme that arrives from another device
export default function PreferenceSync() {
  useEffect(() => {
    const stopTheme = onSettingsChange((settings, source) => {
      if (source === "remote") applyTheme(settings.theme);
    });
    const stopSync = startPreferenceSync();

    return () => {
      stopTheme();
      stopSync();
    };
  }, []);

  return null;
}
