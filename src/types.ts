export const FPS = 30;

export type Sticker = {
  text: string;
  /** Seconds into the scene when it pops in. */
  at: number;
  /** Vertical position in px on the 1080x1920 canvas. */
  y?: number;
  size?: number;
  tilt?: number;
  /** Strike-through, good for "the old way" jokes. */
  strike?: boolean;
  color?: string;
};

export type Scene = {
  id: string;
  /** Seconds. */
  dur: number;
  bg?: string;
  ink?: string;
  stickers: Sticker[];
  /** Voice line. `text` is shown as the caption and (unless `say` is set) spoken. */
  vo?: { text: string; say?: string; at?: number };
  /** Set by scripts/render.ts after the voice is generated, never write it by hand. */
  _audio?: string;
};

export type ReelSpec = {
  id: string;
  lang: "en" | "ta";
  palette: { bg: string; ink: string; pop: string };
  scenes: Scene[];
};

export const sceneFrames = (s: Scene) => Math.round(s.dur * FPS);
export const totalFrames = (r: ReelSpec) => r.scenes.reduce((n, s) => n + sceneFrames(s), 0);
