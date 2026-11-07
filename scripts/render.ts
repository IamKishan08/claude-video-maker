// pnpm render <spec-id> [--preview]
// specs/<id>.json -> (voice, cached) -> out/review/<id>.mp4. Non-English specs are refused until a native reader approves.
import { createHash } from "node:crypto";
import { copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import { ReelSpec } from "../src/types";
import { speak } from "./tts";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const id = args.find((a) => !a.startsWith("--"));
if (!id) throw new Error("usage: pnpm render <spec-id> [--preview]");
const preview = args.includes("--preview");
const spec: ReelSpec = JSON.parse(readFileSync(join(ROOT, "specs", `${id}.json`), "utf8"));

// Approval gate: the hash covers every spoken/shown line, so any edit after approval blocks the render again.
if (spec.lang !== "en") {
  const lines = spec.scenes.flatMap((s) => [s.vo?.text, s.vo?.say, ...s.stickers.map((k) => k.text)]).filter(Boolean);
  const hash = createHash("sha256").update(JSON.stringify(lines)).digest("hex").slice(0, 16);
  const file = join(ROOT, "scripts/APPROVED_LANG");
  const approved = existsSync(file) ? readFileSync(file, "utf8") : "";
  if (!approved.includes(`${id} sha256_16=${hash}`))
    throw new Error(`Lines of "${id}" are not approved by a native reader.\nAfter they approve, add this line to scripts/APPROVED_LANG:\n${id} sha256_16=${hash}`);
}

// Optional .env (no dependency): KEY=value lines.
const envFile = join(ROOT, ".env");
if (existsSync(envFile))
  for (const l of readFileSync(envFile, "utf8").split(/\r?\n/)) {
    const m = l.match(/^([A-Z_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^"|"$/g, "");
  }

const voiceDir = join(ROOT, "public/voice", id);
mkdirSync(voiceDir, { recursive: true });
for (const s of spec.scenes) {
  if (!s.vo) continue;
  const f = await speak(s.vo.say ?? s.vo.text, join(ROOT, ".cache/tts"));
  if (f) { copyFileSync(f, join(voiceDir, basename(f))); s._audio = `voice/${id}/${basename(f)}`; }
}
if (!process.env.ELEVENLABS_API_KEY) console.warn("! No ELEVENLABS_API_KEY: rendering silent (captions only).");

const serveUrl = await bundle({ entryPoint: join(ROOT, "src/index.ts"), publicDir: join(ROOT, "public") });
const comp = await selectComposition({ serveUrl, id: "Reel9x16", inputProps: { spec } });
mkdirSync(join(ROOT, "out/review"), { recursive: true });
const outputLocation = join(ROOT, "out/review", `${id}${preview ? ".preview" : ""}.mp4`);
await renderMedia({ composition: comp, serveUrl, codec: "h264", outputLocation, inputProps: { spec }, scale: preview ? 0.5 : 1 });
console.log(`Done: ${outputLocation}\nNothing is published. Move it to out/approved/ yourself after you have watched it.`);
