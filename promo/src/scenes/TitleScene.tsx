import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { color, ease, space } from "../tokens";
import { storyboard } from "../storyboard";
import { span } from "../time";
import { Backdrop, HeroGrid } from "../components/Backdrop";
import { Subtitle } from "../components/KineticHeadline";
import { KineticWordmark } from "../components/KineticWordmark";

const { beats, copy } = storyboard.title;

export const TitleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const white = 1 - span(frame, beats.whiteToBlack, ease.inOut);
  const grid = span(frame, beats.gridIn, ease.out);
  const out = span(frame, beats.fadeOut, ease.inOut);

  return (
    <AbsoluteFill>
      <Backdrop rails={grid}>
        <HeroGrid opacity={grid * (1 - out)} />
      </Backdrop>
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: space(8),
          opacity: 1 - out,
        }}
      >
        <KineticWordmark start={beats.wordmarkIn} name={copy.wordmark} />
        <Subtitle text={copy.subtitle} start={beats.subtitleIn} />
      </AbsoluteFill>
      {/* the loop point: the white frame the ending leaves dips to black */}
      <AbsoluteFill style={{ background: color.white, opacity: white }} />
    </AbsoluteFill>
  );
};
