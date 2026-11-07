import React from "react";
import { Composition } from "remotion";
import { Reel } from "./Reel";
import demo from "../specs/demo.json";
import { FPS, ReelSpec, totalFrames } from "./types";

// Studio preview shows the demo spec. scripts/render.ts passes the spec you choose as inputProps.
export const Root: React.FC = () => (
  <Composition
    id="Reel9x16"
    component={Reel as React.FC<any>}
    width={1080} height={1920} fps={FPS}
    durationInFrames={totalFrames(demo as ReelSpec)}
    defaultProps={{ spec: demo as ReelSpec }}
    calculateMetadata={({ props }) => ({ durationInFrames: totalFrames((props as any).spec) })}
  />
);
