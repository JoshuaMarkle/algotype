import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { ease } from "../tokens";
import { storyboard } from "../storyboard";
import { mix, span } from "../time";
import { Backdrop } from "../components/Backdrop";
import { ToggleGroup } from "../components/ToggleGroup";

const { beats, copy } = storyboard.controlSwitch;

// Where the control lives in the account scene (centre of the control)
export const CONTROL_PLACE = { x: 960, y: 112 };
const ZOOM = 2.2;

// Rendered in both scenes so the hand-off is seamless
export const PlacedControl: React.FC<{ active: number; scale?: number; y?: number; opacity?: number }> = ({
  active,
  scale = 1,
  y = CONTROL_PLACE.y,
  opacity = 1,
}) => (
  <div
    style={{
      position: "absolute",
      left: CONTROL_PLACE.x,
      top: y,
      transform: `translate(-50%, -50%) scale(${scale})`,
      opacity,
    }}
  >
    <ToggleGroup options={copy.options} active={active} />
  </div>
);

export const ControlSwitchScene: React.FC = () => {
  const frame = useCurrentFrame();
  const zin = span(frame, beats.controlIn, ease.out);
  const sw = span(frame, beats.switch, ease.inOut);
  const back = span(frame, beats.flyBack, ease.inOut);

  return (
    <AbsoluteFill>
      <Backdrop />
      <PlacedControl
        active={sw}
        scale={mix(mix(ZOOM * 0.85, ZOOM, zin), 1, back)}
        y={mix(540, CONTROL_PLACE.y, back)}
        opacity={zin}
      />
    </AbsoluteFill>
  );
};
