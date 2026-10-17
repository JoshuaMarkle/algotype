import type React from "react";
import type { SceneName } from "../storyboard";
import { TitleScene } from "./TitleScene";
import { TypingScene } from "./TypingScene";
import { ResultsScene } from "./ResultsScene";
import { ControlSwitchScene } from "./ControlSwitchScene";
import { AccountScene } from "./AccountScene";
import { EndScene } from "./EndScene";

export const scenes: Record<SceneName, React.FC> = {
  title: TitleScene,
  typing: TypingScene,
  results: ResultsScene,
  controlSwitch: ControlSwitchScene,
  account: AccountScene,
  end: EndScene,
};
