import React from "react";
import { Composition, Folder } from "remotion";
import "./fonts";
import { VIDEO } from "./tokens";
import { sec } from "./time";
import { KitCharts, KitEditor, KitHeadline, KitStats } from "./Kit";

const kit = { KitHeadline, KitCharts, KitEditor, KitStats };

export const Root: React.FC = () => (
  <>
    <Folder name="Kit">
      {Object.entries(kit).map(([id, C]) => (
        <Composition
          key={id}
          id={id}
          component={C}
          durationInFrames={sec(3)}
          fps={VIDEO.fps}
          width={VIDEO.width}
          height={VIDEO.height}
        />
      ))}
    </Folder>
  </>
);
