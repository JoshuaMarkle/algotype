import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { color, role } from "../tokens";
import { storyboard } from "../storyboard";
import { span } from "../time";
import { KineticWordmark } from "../components/KineticWordmark";
import { Glitch, scramble } from "../components/Glitch";

const { beats, copy } = storyboard.end;

// Wordmark centred on white; a short glitch takes it out to a blank white
// frame, the same frame the title opens on, so the video loops.
export const EndScene: React.FC = () => {
  const frame = useCurrentFrame();
  const g = span(frame, beats.glitch, (x) => x);
  const name = g > 0 ? scramble(copy.wordmark, Math.min(1, g * 1.6), frame) : copy.wordmark;

  return (
    <AbsoluteFill style={{ background: color.white, justifyContent: "center", alignItems: "center" }}>
      <Glitch
        t={g}
        frame={frame}
        render={(split) => (
          <KineticWordmark
            start={beats.wordmarkIn}
            name={name}
            color={split ? role.accent : color.bg}
            markColor={role.accent}
          />
        )}
      />
    </AbsoluteFill>
  );
};
