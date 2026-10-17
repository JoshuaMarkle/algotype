import React from "react";
import { AbsoluteFill, Series } from "remotion";
import { role } from "./tokens";
import { sceneOrder, storyboard } from "./storyboard";
import { sec } from "./time";
import { scenes } from "./scenes";

// The whole film: the scenes back to back, in storyboard order
export const Promo: React.FC = () => (
  <AbsoluteFill style={{ background: role.canvas }}>
    <Series>
      {sceneOrder.map((name) => {
        const Scene = scenes[name];
        return (
          <Series.Sequence key={name} durationInFrames={sec(storyboard[name].length)} name={name}>
            <Scene />
          </Series.Sequence>
        );
      })}
    </Series>
  </AbsoluteFill>
);

export const promoFrames = sceneOrder.reduce((sum, name) => sum + sec(storyboard[name].length), 0);
