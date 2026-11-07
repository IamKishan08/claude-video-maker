# Claude Video Maker

Make Instagram Reels / Shorts from a JSON spec with Claude Code and Remotion. You describe the idea, Claude writes the script and the spec, you approve, it renders. Works in English and Tamil (or any language, with an approval gate).

## 0. What you need
- Node 20+ and pnpm (`npm i -g pnpm`)
- Claude Code, logged in with your own account (no API key needed)
- Optional: an ElevenLabs key for voice. Without it, reels render silent with captions.

## 1. Setup (2 minutes)
```bash
pnpm install
cp .env.example .env      # optional: add ELEVENLABS_API_KEY and ELEVENLABS_VOICE_ID
pnpm render demo --preview   # proves it works: out/review/demo.preview.mp4
pnpm studio                  # live preview in the browser
```

## 2. Make your first reel
Open this folder in Claude Code and type:
```
/make-reel 30 second reel: 3 mistakes new shop owners make with billing
```
Claude will:
1. write a hook, beats and a script, then **stop for your approval**
2. create `specs/<id>.json`
3. run `pnpm render <id> --preview`
4. hand you `out/review/<id>.mp4` to watch

Ask for changes in plain words ("make the hook shorter", "swap scene 2 to a dark background"). Re-run the render each time.

## 3. How it fits together
| File | Job |
|---|---|
| `specs/<id>.json` | the whole reel: scenes, stickers, voice lines |
| `src/Reel.tsx` | how a spec is drawn (edit this to change the look) |
| `src/types.ts` | every field a spec may use |
| `scripts/render.ts` | voice, approval gate, render |
| `CLAUDE.md` | rules Claude follows every session. **Edit these to match your brand** |
| `.claude/commands/make-reel.md` | the `/make-reel` workflow |

## 4. Tamil (or any non-English) reels
Set `"lang": "ta"` in the spec. The render **refuses** until a native reader approves the exact lines:
1. Run `pnpm render <id>`. It prints a line like `my-reel sha256_16=ab12...`
2. After a native reader has approved the script, paste that line into `scripts/APPROVED_LANG`.
3. If anyone edits a line afterwards, the hash changes and the render is blocked again.

Tips for Tamil: write the way people speak, keep words like GST, bill, app in English. For TTS, spell hard words phonetically in `vo.say` while showing the proper spelling in `vo.text`.

## 5. Add your own footage
Put real screen recordings in `public/`. Extend `Scene` in `src/types.ts` with a `clip` field and render it with `<OffthreadVideo>` in `Reel.tsx`; ask Claude: "add a clip scene type that plays public/<file>.mp4". Use real footage only.

## 6. Before you post
- Watch the whole file with sound on and sound off
- Check every number and claim against its source
- Say "AI voice" in the caption if the voice is generated
- Add UTM parameters to every link
- Move the file to `out/approved/` yourself. Claude never does.

## Ideas to prompt Claude with
- "Reel: what happens when a shop's internet goes off" (comedy, 3 scenes)
- "Reel: 3 things I learned building an app with AI"
- "Remake specs/demo.json in my brand colours"
