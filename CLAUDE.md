# Reel template: rules every Claude Code session follows

You are helping make short vertical videos (Instagram Reels, Shorts) from a JSON spec, using Remotion.

## How the project works
- One reel = one file: `specs/<id>.json` (scenes, stickers, optional voice lines). Types are in `src/types.ts`.
- `src/Reel.tsx` draws the spec. Change the look there, never inside a spec.
- `pnpm render <id>` writes `out/review/<id>.mp4`. `pnpm studio` previews live. `pnpm check` type-checks.
- Voice is optional (ElevenLabs, see `.env.example`). With no key the reel renders silent with captions.

## Rules (edit these to match your brand)
1. Never fabricate footage, testimonials, user counts, ratings or reviews. Use real recordings only.
2. Never label an AI voice as a real person. Say "AI voice" in the caption.
3. Any non-English script needs a native reader's approval before audio is rendered. `scripts/render.ts` enforces this through `scripts/APPROVED_LANG`. Never write that file yourself: ask the human.
4. Nothing moves from `out/review/` to `out/approved/` without the human saying so.
5. Never commit `.env` or API keys. Never call paid APIs from tests; mock them.
6. Prices, numbers and claims on screen must come from a source file, never typed from memory.
7. Every link carries UTM parameters.

## Workflow for a new reel
Use the slash command `/make-reel <idea>`. It walks through: hook, script, human approval, spec, preview, review.
Keep reels 20 to 40 seconds. The hook must read with the sound off inside 2 seconds.
