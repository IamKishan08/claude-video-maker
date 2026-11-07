// Minimal ElevenLabs text-to-speech with an on-disk cache. Never call this from tests: mock it.
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

export async function speak(text: string, outDir: string): Promise<string | null> {
  const key = process.env.ELEVENLABS_API_KEY, voice = process.env.ELEVENLABS_VOICE_ID;
  if (!key || !voice) return null; // silent render: captions only
  const hash = createHash("sha256").update(`${voice}|${text}`).digest("hex").slice(0, 16);
  const file = join(outDir, `${hash}.mp3`);
  if (existsSync(file)) return file;
  mkdirSync(outDir, { recursive: true });
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}`, {
    method: "POST",
    headers: { "xi-api-key": key, "content-type": "application/json", accept: "audio/mpeg" },
    body: JSON.stringify({ text, model_id: "eleven_v3" }),
  });
  if (!res.ok) throw new Error(`ElevenLabs ${res.status}: ${await res.text()}`);
  writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  return file;
}
