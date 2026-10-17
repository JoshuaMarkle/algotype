import React from "react";
import { Composition, Folder } from "remotion";
import "./fonts";
import { VIDEO } from "./tokens";
import { sceneOrder, storyboard } from "./storyboard";
import { sec } from "./time";
import { Promo, promoFrames } from "./Promo";
import { scenes } from "./scenes";
const sceneId = (name: string) => `Scene-${name[0].toUpperCase()}${name.slice(1)}`;

const common = { fps: VIDEO.fps, width: VIDEO.width, height: VIDEO.height };

export const Root: React.FC = () => (
  <>
    <Composition id="Promo" component={Promo} durationInFrames={promoFrames} {...common} />
    <Folder name="Scenes">
      {sceneOrder.map((name) => (
        <Composition
          key={name}
          id={sceneId(name)}
          component={scenes[name]}
          durationInFrames={sec(storyboard[name].length)}
          {...common}
        />
      ))}
    </Folder>
  </>
);
