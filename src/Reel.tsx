import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/NotoSansTamil";
import { ReelSpec, Scene, Sticker, FPS, sceneFrames } from "./types";

const { fontFamily } = loadFont("normal", { weights: ["700", "900"], subsets: ["tamil"], ignoreTooManyRequestsWarning: true });
const FONT = `${fontFamily}, "Segoe UI", system-ui, sans-serif`;

const StickerView: React.FC<{ s: Sticker; ink: string; pop: string }> = ({ s, ink, pop }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame - Math.round(s.at * FPS);
  if (t < 0) return null;
  const pop01 = spring({ frame: t, fps, config: { damping: 11, stiffness: 180 } });
  const size = s.size ?? 110;
  return (
    <div
      style={{
        position: "absolute", left: 60, right: 60, top: s.y ?? 700, textAlign: "center",
        fontFamily: FONT, fontWeight: 900, fontSize: size, lineHeight: 1.1,
        color: s.color ?? ink, textDecoration: s.strike ? "line-through" : "none",
        transform: `scale(${interpolate(pop01, [0, 1], [0.4, 1])}) rotate(${s.tilt ?? 0}deg)`,
        opacity: Math.min(1, pop01 * 2), textShadow: `0 6px 0 ${pop}33`,
      }}
    >
      {s.text}
    </div>
  );
};

const Caption: React.FC<{ text: string; ink: string }> = ({ text, ink }) => (
  <div style={{ position: "absolute", left: 70, right: 70, bottom: 360, textAlign: "center", fontFamily: FONT, fontWeight: 700, fontSize: 52, color: ink, opacity: 0.85 }}>
    {text}
  </div>
);

const SceneView: React.FC<{ scene: Scene; spec: ReelSpec }> = ({ scene, spec }) => {
  const ink = scene.ink ?? spec.palette.ink;
  return (
    <AbsoluteFill style={{ background: scene.bg ?? spec.palette.bg }}>
      {scene.stickers.map((s, i) => <StickerView key={i} s={s} ink={ink} pop={spec.palette.pop} />)}
      {scene.vo && <Caption text={scene.vo.text} ink={ink} />}
      {scene._audio && <Sequence from={Math.round((scene.vo?.at ?? 0) * FPS)}><Audio src={staticFile(scene._audio)} /></Sequence>}
    </AbsoluteFill>
  );
};

export const Reel: React.FC<{ spec: ReelSpec }> = ({ spec }) => {
  let from = 0;
  return (
    <AbsoluteFill>
      {spec.scenes.map((sc) => {
        const el = <Sequence key={sc.id} from={from} durationInFrames={sceneFrames(sc)}><SceneView scene={sc} spec={spec} /></Sequence>;
        from += sceneFrames(sc);
        return el;
      })}
    </AbsoluteFill>
  );
};
